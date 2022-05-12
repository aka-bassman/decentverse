import { RootState } from "../redux";
export const SLICE_NAME = "world";

export const keyTypes = ["left", "right", "up", "down"] as const;
export type KeyType = typeof keyTypes[number];
export type Keyboard = { [key in KeyType]: boolean };
export interface GameState {
  loopInterval: number;
  keyboard: Keyboard;
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: GameState = {
  loopInterval: 500,
  keyboard: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
  status: "none",
};
export const select = {
  gameStatus: (state: RootState) => state.game.status,
  keyboard: (state: RootState) => state.game.keyboard,
};
