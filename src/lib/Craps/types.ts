import type { BetType } from './rules';

export type DiceRoll = [number, number];

export type GameState = {
  roll: DiceRoll;
  tick?: number;
  cash: number;
  table: number;
};

export type BankFn = (amount: number, table: number) => void;

export type Bet = {
  type: BetType;
  on?: number;
  amount: number;
  paid?: number;
  key: number;
};
