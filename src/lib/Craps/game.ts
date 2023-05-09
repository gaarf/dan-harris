import { createContext } from "react";
import type { GameState } from "./types";

export const GameContext = createContext<GameState>({
  roll: [1, 1],
  cash: 0,
  table: 0
});
