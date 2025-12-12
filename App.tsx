import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { COLORS, SUITS, POSITIONS, CARD_VALUES, DEFAULT_QA_DATA } from './constants';
import { CardState, LaiziState, Position, SuitKey, CardValue, QAEntry } from './types';
import { findStrategyAnswer, playSound } from './utils';

interface CardButtonProps {
  suit: typeof SUITS[0];
  pos: Position;
  val: CardValue;
  count: number;
  onClick: (key: string, isRightClick: boolean) => void;
}

const CardButton: React.FC<CardButtonProps> = ({ suit, pos, val, count, onClick }) => {
  const key = `${suit.key}-${pos}-${val}`;
  const timeoutRef = useRef<any>(null);
  const isTouchRef = useRef(false);

  // Mouse Handlers (Desktop)
  const handleMouseDown = () => {
      if (isTouchRef.current) return;
      timeoutRef.current = setTimeout(() => {
         onClick(key, true); // Long press
         timeoutRef.current = null;
      }, 500);
  };

  const handleMouseUp = () => {
      if (isTouchRef.current) return;
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          onClick(key, false); // Short click
      }
  };

  const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Touch Handlers (Mobile)
  const handleTouchStart = () => {
      isTouchRef.current = true;
      timeoutRef.current = setTimeout(() => {
         onClick(key, true); // Long press
         timeoutRef.current = null;
      }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      // Prevent mouse emulation to avoid double clicks
      if (e.cancelable) e.preventDefault();
      
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          onClick(key, false); // Short tap
      }
      
      // Reset touch flag after a delay to allow mixed usage if needed
      setTimeout(() => isTouchRef.current = false, 500);
  };
  
  const handleTouchMove = () => {
      // If user drags/scrolls, cancel the tap/long-press
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
  };

  const handleContext = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isTouchRef.current) onClick(key, true);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center p-0.5"
    >
      <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onContextMenu={handleContext}
          className={`
              w-full h-10 border rounded shadow-sm flex flex-col items-center justify-center select-none active:scale-95 transition-transform touch-manipulation
              ${count > 0 ? 'bg-[#4CAF50] text-white' : 'bg-[#f0f0f0]'}
          `}
          style={{ color: count > 0 ? 'white' : suit.color }}
      >
          <span className="font-bold text-lg leading-none">{val}</span>
          <span className={`text-[10px] leading-none ${count > 0 ? 'text-white' : 'text-gray-500'}`}>{count}</span>
      </button>
    </div>
  );
};

// New LaiziButton component to handle long press functionality
interface LaiziButtonProps {
  posKey: Position;
  count: number;
  onClick: (pos: Position, isRightClick: boolean) => void;
}

const LaiziButton: React.FC<LaiziButtonProps> = ({ posKey, count, onClick }) => {
  const timeoutRef = useRef<any>(null);
  const isTouchRef = useRef(false);

  const handleMouseDown = () => {
      if (isTouchRef.current) return;
      timeoutRef.current = setTimeout(() => {
         onClick(posKey, true);
         timeoutRef.current = null;
      }, 500);
  };

  const handleMouseUp = () => {
      if (isTouchRef.current) return;
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          onClick(posKey, false);
      }
  };

  const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTouchStart = () => {
      isTouchRef.current = true;
      timeoutRef.current = setTimeout(() => {
         onClick(posKey, true);
         timeoutRef.current = null;
      }, 500);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          onClick(posKey, false);
      }
      setTimeout(() => isTouchRef.current = false, 500);
  };
  
  const handleTouchMove = () => {
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
  };

  const handleContext = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isTouchRef.current) onClick(posKey, true);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded px-1 border border-gray-300 w-12 cursor-pointer select-none active:scale-95 transition-transform touch-manipulation"
         onMouseDown={handleMouseDown}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseLeave}
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}
         onTouchMove={handleTouchMove}
         onContextMenu={handleContext}
    >
        <span className="text-[10px] text-gray-600">癞子</span>
        <span className={`font-bold ${count > 0 ? 'text-[#4CAF50]' : 'text-black'}`}>
            {count}
        </span>
    </div>
  );
};

export default function App() {
  // State
  const [counts, setCounts] = useState<CardState>({});
  const [laizi, setLaizi] = useState<LaiziState>({ up: 0, middle: 0, down: 0 });
  const [summary, setSummary] = useState<ReactNode>("请点击牌面记录各玩家的牌，然后点击\"计算统计\"按钮查看结果。\n\n点击增加，长按减少。");
  const [showModal, setShowModal] = useState<'help' | 'strategy' | 'qa' | null>(null);
  
  // Initialize qaDb from localStorage or default
  const [qaDb, setQaDb] = useState<QAEntry[]>(() => {
    try {
      const saved = localStorage.getItem('baque_qa_db');
      return saved ? JSON.parse(saved) : DEFAULT_QA_DATA;
    } catch(e) {
      console.error("Failed to parse QA DB from storage", e);
      return DEFAULT_QA_DATA;
    }
  });
  
  const [strategyInput, setStrategyInput] = useState("");
  const [isSubMode, setIsSubMode] = useState(false); // Toggle for touch friendliness

  // QA Modal State
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [showQaList, setShowQaList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save QA to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('baque_qa_db', JSON.stringify(qaDb));
    } catch (e) {
      console.error("Failed to save QA DB", e);
    }
  }, [qaDb]);

  // Handlers
  const handleCardClick = (key: string, isRightClick: boolean = false) => {
    // Sound Effect
    if (isSubMode || isRightClick) {
        playSound('delete');
    } else {
        playSound('tap');
    }

    setCounts(prev => {
      const current = prev[key] || 0;
      let next = current;
      
      // Logic: If SubMode or RightClick -> Decrement, else Increment
      if (isSubMode || isRightClick) {
        if (current > 0) next = current - 1;
      } else {
        if (current < 3) next = current + 1;
      }
      
      if (next === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: next };
    });
  };

  const handleLaiziClick = (pos: Position, isRightClick: boolean = false) => {
    // Sound Effect
    if (isSubMode || isRightClick) {
        playSound('delete');
    } else {
        playSound('tap');
    }

    setLaizi(prev => {
      const current = prev[pos];
      let next = current;
      if (isSubMode || isRightClick) {
        if (current > 0) next = current - 1;
      } else {
        if (current < 4) next = current + 1;
      }
      return { ...prev, [pos]: next };
    });
  };

  const reset = () => {
    playSound('clear');
    setCounts({});
    setLaizi({ up: 0, middle: 0, down: 0 });
    setSummary("请点击牌面记录各玩家的牌。\n点击增加，长按减少。");
  };

  const calculate = () => {
    try {
      // Aggregations
      const playerTotals: Record<Position, number> = { up: 0, middle: 0, down: 0 };
      const suitTotals: Record<SuitKey, number> = { 'black-peach': 0, 'red-peach': 0, 'plum-flower': 0, 'square': 0 };
      
      let grandTotal = 0;

      Object.entries(counts).forEach(([key, value]) => {
        const count = value as number;
        const parts = key.split('-');
        let suit: SuitKey = 'black-peach'; // default
        let pos: Position = 'up';
        
        // Find matching suit prefix
        for(const s of SUITS) {
            if (key.startsWith(s.key)) {
                suit = s.key;
                break;
            }
        }
        
        // Extract position
        if (key.includes('-up-')) pos = 'up';
        else if (key.includes('-middle-')) pos = 'middle';
        else if (key.includes('-down-')) pos = 'down';
        
        playerTotals[pos] += count;
        suitTotals[suit] += count;
        grandTotal += count;
      });

      // Validations
      if (grandTotal > 104) { alert("总牌数超过104张！"); return; }
      if (Object.values(suitTotals).some(t => t > 26)) { alert("某种花色超过26张！"); return; }
      
      playSound('success');

      // Generate Structured Grid Layout
      const resultGrid = (
        <div className="flex flex-row w-full h-full text-xs sm:text-sm items-stretch">
            {POSITIONS.map((pos, index) => {
                const total = playerTotals[pos.key] + laizi[pos.key];
                return (
                    <div key={pos.key} className={`flex-1 flex flex-col ${index < POSITIONS.length - 1 ? 'border-r border-gray-200' : ''} px-1.5`}>
                        {/* Header */}
                        <div className="font-bold border-b pb-1 mb-1 text-center bg-gray-50 rounded-t py-1">
                            {pos.name}: {total}张
                        </div>
                        
                        {/* Suits */}
                        <div className="flex-1 space-y-1 overflow-y-auto">
                            {SUITS.map(suit => {
                                const cards: string[] = [];
                                let suitCount = 0;
                                CARD_VALUES.forEach(val => {
                                    const key = `${suit.key}-${pos.key}-${val}`;
                                    const count = counts[key] || 0;
                                    if (count > 0) {
                                        cards.push(Array(count).fill(val).join(""));
                                        suitCount += count;
                                    }
                                });
                                const txt = cards.length ? cards.join(" ") : "无";
                                const hasCards = cards.length > 0;
                                
                                return (
                                    <div key={suit.key} className={`flex flex-col items-start ${hasCards ? 'text-black' : 'text-gray-400'}`}>
                                        <div className="flex items-center space-x-1 w-full">
                                            <span style={{color: suit.color}} className="font-bold min-w-[2.5em] text-sm">
                                                【{suit.name}{suit.symbol}】
                                            </span>
                                            <span className="text-[#4CAF50] text-xs font-bold">
                                                {suitCount}张
                                            </span>
                                        </div>
                                        <div className={`pl-2 break-all font-mono leading-tight ${hasCards ? "font-bold" : "font-normal"}`}>
                                            {txt}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Laizi */}
                            <div className="mt-1 pt-1 border-t border-dashed border-gray-300">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-black font-bold">癞子</span>
                                    <span className={`font-bold ${laizi[pos.key] > 0 ? "text-[#4CAF50]" : "text-gray-400"}`}>
                                        {laizi[pos.key] > 0 ? `${laizi[pos.key]}张` : "无"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      );

      setSummary(resultGrid);

    } catch (e) {
      alert("计算错误");
    }
  };

  const calculatePosition = (pos: Position) => {
      let totalCards = laizi[pos];
      const suitDetails: Record<SuitKey, string> = { 'black-peach': '', 'red-peach': '', 'plum-flower': '', 'square': '' };
      const suitCounts: Record<SuitKey, number> = { 'black-peach': 0, 'red-peach': 0, 'plum-flower': 0, 'square': 0 };

      SUITS.forEach(suit => {
          const cardsList: string[] = [];
          CARD_VALUES.forEach(val => {
              const key = `${suit.key}-${pos}-${val}`;
              const count = counts[key] || 0;
              if (count > 0) {
                  for(let i=0; i<count; i++) cardsList.push(val);
                  totalCards += count;
                  suitCounts[suit.key] += count;
              }
          });
          suitDetails[suit.key] = cardsList.length ? cardsList.join(" ") : "无";
      });

      const posName = POSITIONS.find(p => p.key === pos)?.name;
      
      const resultView = (
        <div className="flex flex-col w-full h-full justify-center">
            <div className="w-full">
                <div className="font-bold border-b pb-1 mb-1 text-center bg-gray-50 rounded-t text-sm">
                    {posName}: {totalCards}张
                </div>
                <div className="flex flex-col px-2">
                    {SUITS.map(suit => {
                        const count = suitCounts[suit.key];
                        const details = suitDetails[suit.key];
                        return (
                            <div key={suit.key} className="mb-1">
                                <div className="flex items-center">
                                    <span style={{color: suit.color}} className="font-bold text-sm">
                                        【{suit.name}{suit.symbol}】
                                    </span>
                                    <span className="ml-2 text-[#4CAF50] font-bold text-sm">
                                        {count}张
                                    </span>
                                </div>
                                <div className={`pl-1 mt-0 font-mono text-xs leading-none break-words ${count > 0 ? 'font-bold text-gray-800' : 'text-gray-300'}`}>
                                    {details}
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Laizi */}
                    <div className="mt-1 pt-1 border-t border-dashed border-gray-300 flex items-center pb-1">
                         <span className="font-bold text-black text-sm">癞子</span>
                         <span className="ml-2 font-bold text-[#4CAF50] text-sm">
                            {laizi[pos]}张
                         </span>
                    </div>
                </div>
            </div>
        </div>
      );

      setSummary(resultView);
  };

  const handleStrategySubmit = () => {
      if (!strategyInput.trim()) return;
      const ans = findStrategyAnswer(strategyInput, qaDb);
      setSummary(ans);
      setShowModal(null);
  };

  // --- QA Logic ---
  const handleSaveQa = () => {
      if (!qaQuestion.trim()) { alert("请输入问题"); return; }
      if (!qaAnswer.trim()) { alert("请输入答案"); return; }
      
      const newEntry: QAEntry = { 
          question: qaQuestion.trim(), 
          answer: qaAnswer.trim(), 
          timestamp: new Date().toLocaleString() 
      };
      
      setQaDb(prev => {
          // Update existing or add new
          const filtered = prev.filter(p => p.question !== newEntry.question);
          return [newEntry, ...filtered];
      });
      setQaQuestion("");
      setQaAnswer("");
      playSound('success');
      alert("保存成功");
  };

  const handleDeleteQa = (e: React.MouseEvent, q: string) => {
      e.preventDefault();
      e.stopPropagation();
      // Using setTimeout to detach from the event loop slightly, which can fix issues with confirm dialogs 
      // not appearing or blocking correctly in some mobile webviews.
      setTimeout(() => {
          if(window.confirm("确定删除吗？")) {
               setQaDb(prev => prev.filter(i => i.question !== q));
          }
      }, 10);
  };

  const handleExportQa = () => {
    try {
        const jsonString = JSON.stringify(qaDb, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `baque_qa_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
    } catch(e) {
        alert("导出失败，请重试");
    }
  };

  const handleImportQa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const parsed = JSON.parse(evt.target?.result as string);
            if (Array.isArray(parsed)) {
                setQaDb(parsed);
                alert(`成功导入 ${parsed.length} 条数据`);
            } else {
                alert("文件格式不正确，需要是JSON数组");
            }
        } catch (err) {
            alert("文件解析错误");
        }
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleCheckQa = () => {
    const found = qaDb.find(q => q.question === qaQuestion.trim());
    if (found) {
        setQaAnswer(found.answer);
    } else {
        alert("库中未找到此问题");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans text-gray-900 bg-[#f8f8f8]">
      {/* Header with Safe Area Padding */}
      <div className="flex-none bg-white border-b p-2 pt-[max(0.5rem,env(safe-area-inset-top))] flex items-center justify-between shadow-sm z-10 min-h-[3rem]">
        <h1 className="text-lg font-bold text-gray-800 ml-2 hidden sm:block">八雀牌记牌器</h1>
        <div className="flex space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto justify-end px-2">
            <button onClick={() => { setIsSubMode(!isSubMode); playSound('switch'); }} className={`px-3 py-1 rounded text-sm font-medium border ${isSubMode ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {isSubMode ? '模式: 减' : '模式: 加'}
            </button>
            <button onClick={() => setShowModal('help')} className="px-3 py-1 rounded bg-[#8A2BE2] text-white text-sm shadow">帮助</button>
            <button onClick={() => { playSound('tap'); setShowModal('strategy'); }} className="px-3 py-1 rounded bg-[#FF6347] text-white text-sm shadow">查分</button>
            <button onClick={calculate} className="px-3 py-1 rounded bg-[#4CAF50] text-white text-sm shadow">计算统计</button>
            <button onClick={reset} className="px-3 py-1 rounded bg-[#4CAF50] text-white text-sm shadow">重置</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         {/* Main Card Table */}
         <div className="flex-initial lg:flex-1 flex flex-col overflow-y-auto p-1 bg-white">
            
            {/* Table Header */}
            <div className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 mb-1 text-center font-bold text-sm bg-gray-50 sticky top-0 z-0">
                <div className="flex items-center justify-center p-0.5">
                    <button 
                        onClick={() => { playSound('tap'); setShowModal('qa'); }} 
                        className="bg-[#a4ff00] text-black text-[10px] leading-tight font-bold w-full h-full rounded active:scale-95 transition-transform flex items-center justify-center"
                    >
                        数据录入
                    </button>
                </div>
                {POSITIONS.map(pos => (
                    <div key={pos.key} className="bg-white border rounded p-1 flex flex-row items-center justify-between gap-1 overflow-hidden">
                        <button 
                            onClick={() => { playSound('tap'); calculatePosition(pos.key as Position); }}
                            className="bg-[#8A2BE2] text-white text-xs px-1 py-1 rounded flex-1 truncate active:opacity-80 touch-manipulation"
                        >
                            {pos.name}
                        </button>
                        <LaiziButton 
                            posKey={pos.key as Position}
                            count={laizi[pos.key as Position]}
                            onClick={handleLaiziClick}
                        />
                    </div>
                ))}
            </div>

            {/* Suit Rows */}
            <div className="flex-1 overflow-y-auto pb-4">
                {SUITS.map(suit => (
                    <div key={suit.key} className="grid grid-cols-[3rem_1fr_1fr_1fr] gap-1 mb-1">
                        {/* Suit Label */}
                        <div className="flex items-center justify-center font-bold text-xl border rounded shadow-sm" style={{ color: suit.color, backgroundColor: suit.bgColor }}>
                            {suit.symbol}
                        </div>
                        {/* Player Columns */}
                        {POSITIONS.map(pos => (
                            <div key={`${suit.key}-${pos.key}`} className="border rounded bg-white grid grid-cols-5 sm:grid-cols-9 gap-0 p-0.5">
                                {/* 9 Cards */}
                                {CARD_VALUES.map(val => (
                                    <CardButton 
                                        key={val} 
                                        suit={suit} 
                                        pos={pos.key as Position} 
                                        val={val} 
                                        count={counts[`${suit.key}-${pos.key}-${val}`] || 0}
                                        onClick={handleCardClick}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
         </div>

         {/* Summary Area with Safe Area Padding */}
         <div className="flex-1 lg:flex-none lg:h-full lg:w-1/3 bg-gray-50 border-t lg:border-t-0 lg:border-l p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] overflow-y-auto shadow-inner">
             <div className="bg-white border p-2 h-full rounded overflow-auto text-sm shadow-sm">
                 {typeof summary === 'string' ? (
                     <div className="whitespace-pre-wrap font-mono">{summary}</div>
                 ) : (
                     summary
                 )}
             </div>
         </div>
      </div>

      {/* Modals */}
      {showModal === 'help' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b font-bold text-lg">帮助</div>
                  <div className="p-4 overflow-y-auto text-sm space-y-3 flex-1">
                      <p>1. 点击牌面 +1 (绿色)，长按或开启"减模式" -1。</p>
                      <p>2. 点击顶部【上家/对家/下家】可查看单人详情。</p>
                      <p>3. 点击【计算统计】查看当前局面的完整分析。</p>
                      <p>4. 【查分】功能可输入牌型代码查询倍数。</p>
                  </div>
                  <div className="p-4 border-t text-right">
                      <button onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-200 rounded">关闭</button>
                  </div>
              </div>
          </div>
      )}

      {showModal === 'strategy' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b font-bold text-lg">牌型查分</div>
                  <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                      <input 
                          type="text" 
                          placeholder="输入如: K32b220 或 6张6"
                          className="w-full border p-2 rounded text-lg uppercase"
                          value={strategyInput}
                          onChange={(e) => setStrategyInput(e.target.value)}
                      />
                      <div className="text-xs text-gray-500 space-y-1">
                          <p>支持格式：</p>
                          <p>• K32b220 (K胡 32倍 220分)</p>
                          <p>• 666 (自然输入)</p>
                          <p>• 3张6和2张A</p>
                      </div>
                  </div>
                  <div className="p-4 border-t flex justify-end space-x-2">
                      <button onClick={() => setShowModal(null)} className="px-4 py-2 bg-gray-200 rounded">取消</button>
                      <button onClick={handleStrategySubmit} className="px-4 py-2 bg-[#4CAF50] text-white rounded">查询</button>
                  </div>
              </div>
          </div>
      )}

      {/* QA Entry Modal */}
      {showModal === 'qa' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                  <div className="p-4 border-b font-bold text-lg text-center">问答录入</div>
                  <div className="p-4 flex-1 overflow-y-auto flex flex-col space-y-4">
                      {!showQaList ? (
                          <>
                            <div className="flex flex-col space-y-1">
                                <label className="font-bold">问题:</label>
                                <input 
                                    className="border p-2 rounded w-full shadow-sm" 
                                    value={qaQuestion} 
                                    onChange={e => setQaQuestion(e.target.value)} 
                                />
                            </div>
                            <div className="flex flex-col space-y-1 flex-1">
                                <label className="font-bold">答案:</label>
                                <textarea 
                                    className="border p-2 rounded w-full h-full min-h-[10rem] shadow-sm resize-none" 
                                    value={qaAnswer} 
                                    onChange={e => setQaAnswer(e.target.value)} 
                                />
                            </div>
                          </>
                      ) : (
                          <div className="space-y-2 h-full">
                             <div className="flex justify-between items-center pb-2 border-b">
                                <h3 className="font-bold">问答库 ({qaDb.length})</h3>
                                <button onClick={() => setShowQaList(false)} className="text-blue-500 text-sm">返回录入</button>
                             </div>
                             <div className="overflow-y-auto h-full space-y-2 max-h-[50vh]">
                                {qaDb.map((entry, idx) => (
                                    <div key={`${entry.question}-${idx}`} className="border p-2 rounded text-sm flex justify-between items-center bg-gray-50">
                                        <div className="truncate flex-1 mr-2">
                                            <div className="font-bold truncate">{entry.question}</div>
                                            <div className="text-gray-500 truncate text-xs">{entry.answer}</div>
                                        </div>
                                        <div className="flex space-x-1 shrink-0">
                                            <button onClick={() => { setQaQuestion(entry.question); setQaAnswer(entry.answer); setShowQaList(false); }} className="bg-blue-500 text-white px-2 py-1 rounded text-xs touch-manipulation">编辑</button>
                                            <button onClick={(e) => handleDeleteQa(e, entry.question)} className="bg-red-500 text-white px-2 py-1 rounded text-xs touch-manipulation">删除</button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                          </div>
                      )}
                  </div>
                  <div className="p-2 border-t grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs sm:text-sm">
                       <button onClick={handleSaveQa} className="bg-[#4CAF50] text-white py-2 rounded shadow">保存问答</button>
                       <button onClick={() => setShowQaList(!showQaList)} className="bg-[#2196F3] text-white py-2 rounded shadow">问答库</button>
                       <button onClick={() => fileInputRef.current?.click()} className="bg-[#FF9800] text-white py-2 rounded shadow">从文件导入</button>
                       <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImportQa} />
                       <button onClick={handleExportQa} className="bg-[#9C27B0] text-white py-2 rounded shadow">导出库</button>
                       <button onClick={handleCheckQa} className="bg-[#4CAF50] text-white py-2 rounded shadow">查看</button>
                       <button onClick={() => setShowModal(null)} className="bg-[#F44336] text-white py-2 rounded shadow">关闭</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}