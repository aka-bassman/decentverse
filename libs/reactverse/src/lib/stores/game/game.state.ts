import { RootState } from "../redux";
import * as types from "../types";
export const SLICE_NAME = "world";

export interface GameState {
  loopInterval: number;
  keyboard: types.Keyboard;
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
