import create from "zustand";
import * as types from "../types";
export interface GameState {
  loopInterval: number;
  keyboard: types.Keyboard;
  status: "none" | "loading" | "failed" | "idle";
  setKey: (key: types.KeyType, keyState: boolean) => void;
}
export const useGame = create<GameState>((set, get) => ({
  loopInterval: 500,
  keyboard: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
  status: "none",
  setKey: (key: types.KeyType, keyState: boolean) =>
    set((state) => {
      const keyboard = state.keyboard;
      keyboard[key] = keyState;
      return { keyboard };
    }),
}));
