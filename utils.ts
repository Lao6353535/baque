import { CardState, QAEntry } from './types';
import { BAQUE_RULES } from './constants';

export const parseCardQuestion = (question: string): { card: string; count: number }[] | null => {
    let cleaned = question.replace(/[?？，。,.、!！]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim().toUpperCase();

    const cnNumMap: Record<string, number> = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
    };

    // Helper to parse pure sequence like "666"
    const parseSequence = (text: string) => {
        const validCards = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const result: { card: string; count: number }[] = [];
        // simple alphanum filter
        const t = text.replace(/[^0-9JQKA]/g, '');
        
        // This is a simplified logic of the python one for sequences
        // Python one iterates char by char and handles '10'. 
        let currentCard = '';
        let count = 0;
        let i = 0;
        
        while(i < t.length) {
            let c = '';
            if (i + 1 < t.length && t.substring(i, i+2) === '10') {
                c = '10';
                i += 2;
            } else {
                c = t[i];
                i += 1;
            }
            
            if (validCards.includes(c)) {
                if (c !== currentCard) {
                    if (currentCard && count > 0) result.push({ card: currentCard, count });
                    currentCard = c;
                    count = 1;
                } else {
                    count++;
                }
            }
        }
        if (currentCard && count > 0) result.push({ card: currentCard, count });
        return result.length > 0 ? result : null;
    };
    
    // Try sequence first
    const seqResult = parseSequence(cleaned);
    if (seqResult) return seqResult;

    // Regex parsing
    const pattern = /([一二三四五六七八九十\d]+)张([6-9]|10|[JjQqKkAa])/gi;
    const result: { card: string; count: number }[] = [];
    
    // JS Regex all matches
    let match;
    while ((match = pattern.exec(cleaned)) !== null) {
        let countStr = match[1];
        let card = match[2].toUpperCase();
        let count = cnNumMap[countStr] || parseInt(countStr);
        if (!isNaN(count)) {
             result.push({ card, count });
        }
    }
    
    return result.length > 0 ? result : null;
};

export const getCardPointValue = (card: string): number => {
    const c = card.toUpperCase();
    if (['6', '7', '8', '9', '10'].includes(c)) return 10;
    if (['J', 'Q', 'K'].includes(c)) return 20;
    if (c === 'A') return 30;
    return 0;
};

export const findStrategyAnswer = (question: string, database: QAEntry[]): string => {
    const qLower = question.toLowerCase().trim();
    
    // 1. Direct DB match
    const dbMatch = database.find(e => e.question.toLowerCase() === qLower);
    if (dbMatch) return dbMatch.answer;

    // 2. Multiplier Rules
    const multipliers = {
        "100倍": 100, "100b": 100,
        "50倍": 50, "50b": 50,
        "32倍": 32, "32b": 32,
        "16倍": 16, "16b": 16,
        "8倍": 8, "8b": 8,
        "4倍": 4, "4b": 4,
        "2倍": 2, "2b": 2,
        "1倍": 1, "1b": 1
    };
    if (multipliers[qLower as keyof typeof multipliers]) {
         const target = multipliers[qLower as keyof typeof multipliers];
         let res = `八雀牌${target}倍牌型：\n`;
         for (const [pattern, rule] of Object.entries(BAQUE_RULES)) {
             if (rule.includes(`倍数x${target}`)) {
                 res += `• ${pattern}：${rule}\n`;
             }
         }
         return res;
    }

    // 3. Rule name match
    if (BAQUE_RULES[question]) {
        return `规则说明：${BAQUE_RULES[question]}`;
    }

    // 4. Regex Pattern K32B220
    const pattern = /^([0-9JQKA])(\d+)[bB](\d+)$/;
    const match = question.match(pattern);
    if (match) {
        // In the python code this checks a dictionary. 
        // Since we don't have the full hardcoded dictionary in the snippet provided, 
        // we return a standard "Not Found" message that mimics the python behavior
        return "未找到匹配的八雀牌组合。\n\n查询格式说明：\n1. 第一位：表示胡的牌\n2. 中间：倍数+b\n3. 最后：分数\n例如：K32b220";
    }

    // 5. Card Calculation
    const cardsInfo = parseCardQuestion(question);
    if (cardsInfo) {
        let total = 0;
        let details = "";
        cardsInfo.forEach(item => {
            const p = getCardPointValue(item.card);
            const sub = item.count * p;
            total += sub;
            details += `${item.count}张${item.card}: ${item.count} × ${p}分 = ${sub}分\n`;
        });
        return `答案: ${total}分\n\n计算过程:\n${details}`;
    }
    
    // 6. Generic Help
    if (question.includes("问题1")) return "判断牌局优势技巧...\n(请参考帮助文档)";
    if (question.includes("问题2")) return "计算出牌概率的方法...\n(请参考帮助文档)";

    return "无法解析问题。请尝试输入如 '666' 或 '一张6和两张A'";
};

// --- Sound Logic ---
let audioCtx: AudioContext | null = null;

export const playSound = (type: 'tap' | 'delete' | 'success' | 'clear' | 'switch') => {
  try {
    if (!audioCtx) {
      // Use standard AudioContext or webkit prefix for older iOS
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    
    if (!audioCtx) return;

    // Resume if suspended (browser interaction policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    switch (type) {
      case 'tap': // High pitch short beep (increment)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'delete': // Low pitch beep (decrement)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'success': // Chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'clear': // Descending slide
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
       case 'switch': // Soft click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};