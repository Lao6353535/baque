export type Position = 'up' | 'middle' | 'down';
export type SuitKey = 'black-peach' | 'red-peach' | 'plum-flower' | 'square';
export type CardValue = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface QAEntry {
  question: string;
  answer: string;
  timestamp: string;
}

export interface CardState {
  [key: string]: number; // key format: "suit-position-value", value: count 0-3
}

export interface LaiziState {
  up: number;
  middle: number;
  down: number;
}
