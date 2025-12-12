import { QAEntry, SuitKey, CardValue } from './types';

export const COLORS = {
  primary: "#4CAF50",      // Green
  secondary: "#8A2BE2",    // Purple
  accent: "#FF6347",       // Tomato Red
  card_bg: "#FFFFFF",
  bg_light: "#f8f8f8",
  highlight: "#a4ff00",    // Lime
  disabled: "#d3d3d3",
  hearts: "#e60000",
  spades: "#000000",
};

export const SUITS: { key: SuitKey; symbol: string; name: string; color: string; bgColor: string }[] = [
  { key: 'black-peach', symbol: '♠', name: '黑', color: COLORS.spades, bgColor: '#f0f8ff' },
  { key: 'red-peach', symbol: '♥', name: '红', color: COLORS.hearts, bgColor: '#fff0f5' },
  { key: 'plum-flower', symbol: '♣', name: '梅', color: COLORS.spades, bgColor: '#f0f8ff' },
  { key: 'square', symbol: '♦', name: '方', color: COLORS.hearts, bgColor: '#fff0f5' },
];

export const POSITIONS: { key: 'up' | 'middle' | 'down'; name: string }[] = [
  { key: 'up', name: '上家' },
  { key: 'middle', name: '对家' },
  { key: 'down', name: '下家' },
];

export const CARD_VALUES: CardValue[] = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export const DEFAULT_QA_DATA: QAEntry[] = [
  {
    "question": "K32B220",
    "answer": "AAAAAAK胡K/同花Q",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "64b80",
    "answer": "8888887胡7/同花6和9",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "64B80",
    "answer": "7777778胡8/同花6/9",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "84B80",
    "answer": "8889999胡8/9和同花7/10",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "84B80",
    "answer": "8888666胡8/6",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "84B80",
    "answer": "8888101010胡8/10",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "84B80",
    "answer": "67777910胡8",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "84B80",
    "answer": "99999910胡10/同花8/J",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "84B80",
    "answer": "1010101010109胡9/同花8/J",
    "timestamp": "2025-03-23 23:01:39"
  },
  {
    "question": "78B200",
    "answer": "AAAAAA7胡7",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "88B200",
    "answer": "AAAAAA8胡8",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "98B200",
    "answer": "AAAAAA9胡9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "08B200",
    "answer": "AAAAAA0胡10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "QB8220",
    "answer": "AAAAAAQ胡Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J8B220",
    "answer": "AAAAAAJ胡J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K8B210",
    "answer": "AAAAAKK胡A/K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A32B220",
    "answer": "AAAAAKK胡A/K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q4B220",
    "answer": "AAAAAAK胡K/同花Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K50B110",
    "answer": "T67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q16B110",
    "answer": "T67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "616B100",
    "answer": "T67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "88B100",
    "answer": "T67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "08B100",
    "answer": "T67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "94B100",
    "answer": "T67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "91B100",
    "answer": "67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "68B100",
    "answer": "67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q8B110",
    "answer": "67890JQ胡Q/9/6和同花K/8/10",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A50B130",
    "answer": "7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "650B110",
    "answer": "7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "78B110",
    "answer": "7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "716B110",
    "answer": "T7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K8B120",
    "answer": "T7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K16B120",
    "answer": "T7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "98B110",
    "answer": "T7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J8B120",
    "answer": "T7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "04B110",
    "answer": "T7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "01B110",
    "answer": "7890JQK胡/K/10/7和同花A/6/9/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "750B130",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A8B150",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A16B150",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "88B130",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J1B140",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J4B140",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "08B130",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q8B140",
    "answer": "890JQKA胡A/8/J和同花7/10/Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "68B90",
    "answer": "667890J(6不+6顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q8B100",
    "answer": "667890J(6不+6顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "91B90",
    "answer": "667890J(6不+6顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "616B90",
    "answer": "667890J(6同+6顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "68B90",
    "answer": "667890J(6同+6顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q16B100",
    "answer": "667890J(6同+6顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "64B90",
    "answer": "667890J(6不+5顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "68B90",
    "answer": "667890J(6不+5顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q8B100",
    "answer": "667890J(6不+5顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "91B90",
    "answer": "667890J(6不+5顺）胡6和同花Q/9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "68B200",
    "answer": "AAAAAA6胡6",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A8B220",
    "answer": "AAAAAQQ胡Q/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q4B210",
    "answer": "AAAAAQQ胡Q/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A8B220",
    "answer": "AAAAAJJ胡J/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J4B210",
    "answer": "AAAAAJJ胡J/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A8B200",
    "answer": "AAAAA00(6-9)胡10(6-9)/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "04B180",
    "answer": "AAAAA00胡10/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "94B180",
    "answer": "AAAAA99胡9/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "84B180",
    "answer": "AAAAA88胡8/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "74B180",
    "answer": "AAAAA77胡7/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "64B180",
    "answer": "AAAAA66胡6/A",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A8B210",
    "answer": "AAAAKKK胡A/K同花Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K4B200",
    "answer": "AAAAKKK胡A/K同花Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q1B200",
    "answer": "AAAAKKK胡A/K同花Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A4B210",
    "answer": "AAAAQQQ胡A/Q同花K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q2B200",
    "answer": "AAAAQQQ胡A/Q同花K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q4B200",
    "answer": "AAAAQQQ为同色胡A/Q同花K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K1B200",
    "answer": "AAAAQQQ胡A/Q同花K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "K2B200",
    "answer": "AAAAQQQ为同色胡A/Q同花K",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "Q2B200",
    "answer": "AAAAKKK为同色胡A/K同花Q",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A4B210",
    "answer": "AAAAJJJ胡A/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J2B200",
    "answer": "AAAAJJJ胡A/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "J4B200",
    "answer": "AAAAJJJ为同色胡A/J",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "A4B180",
    "answer": "AAAA000(6-9)胡A/10(6-9)AAAA890胡A/J  AAAA789胡同6/0 AAAA678胡同9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "02B160",
    "answer": "AAAA000胡A/10        AAAA789胡A/6/0",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "04B160",
    "answer": "AAAA000为同色胡A/10  AAAA789为同色胡A/6/0",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "92B160",
    "answer": "AAAA999胡A/9       AAAA678胡A/9 AAAA780胡9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "94B160",
    "answer": "AAAA999为同色胡A/9 AAAA678为同色胡A/9 AAAA780为同色胡9",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "82B160",
    "answer": "AAAA888胡A/8    AAAA790胡8   AAAA679胡8",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "84B160",
    "answer": "AAAA888为同色胡A/8 AAAA790为同色胡8  AAAA679为同色胡8",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "72B160",
    "answer": "AAAA777胡A/7       AAAA890胡A/J  AAAA689胡7",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "74B160",
    "answer": "AAAA777为同色胡A/7 AAAA890为同色胡A/J   AAAA689为同色胡7",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "62B160",
    "answer": "AAAA666胡A/6            AAAA789胡A4B180/02B160",
    "timestamp": "2025-03-26 19:10:34"
  },
  {
    "question": "64B160",
    "answer": "AAAA666为同色胡A/6      AAAA789为同色胡A4B180/04B160",
    "timestamp": "2025-03-26 19:10:34"
  }
];

export const BAQUE_RULES: Record<string, string> = {
    "独一无二": "由八张A组成，倍数x100",
    "君临天下": "由八张K组成，倍数x100",
    "十全十美": "由八张10组成，倍数x100",
    "八方来财": "由八张8组成，倍数x100",
    "顶峰相见": "由K和A构成6+2组合的部分，倍数x32",
    "心心相连": "由J和Q构成6+2组合的部分，倍数x32",
    "十拿九稳": "由10和9构成6+2组合的部分，倍数x32",
    "六事兴旺": "由6和7构成6+2组合的部分，倍数x32",
    "八方来贺": "凑成完整的8张牌，可以是同花顺或8炸，倍数x50",
    "比翼为邻": "凑成6+2的组合，两组是相邻的同点数，倍数x16",
    "六朝金粉": "凑成6+2的组合，八张牌都是同颜色，倍数x16",
    "六六大顺": "凑成6+2的组合，可以是同花顺或同数组，倍数x8",
    "永恒相随": "凑成5+3的组合，两组是相邻的同点数，倍数x8",
    "五谷丰登": "凑成5+3的组合，八张牌都是同颜色，倍数x8",
    "五福临门": "凑成5+3的组合，可以是同花顺或同数组，倍数x4",
    "二龙腾飞": "凑成4+4的组合，两组是相邻的同点数，倍数x4",
    "四季发财": "凑成4+4的组合，八张牌都是同颜色，倍数x4",
    "四季如春": "凑成4+4的组合，可以是同花顺或同数组，倍数x2",
    "平胡": "凑成3+3+2的组合，其中2要求为一对，倍数x1"
};