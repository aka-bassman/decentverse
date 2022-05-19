import create from "zustand";
import * as types from "../types";
export interface GameState {
  loopInterval: number;
  keyboard: types.Keyboard;
  screen: types.Screen;
  status: "none" | "loading" | "failed" | "idle";
  setKey: (key: types.KeyType, keyState: boolean) => void;
  changeScreenSize: (screen: types.Screen) => void;
}
export const useGame = create<GameState>((set, get) => ({
  loopInterval: 500,
  keyboard: {
    left: false,
    right: false,
    up: false,
    down: false,
  },
  signalInterval: 500, // signal interval between server
  ping: 0, // signal time between server
  renderTime: 0, // calculation time per frame period
  render: {
    cameraPos: [0, 0, 1000],
  },
  tileMap: {
    lineTileNum: 2, // 꼭지점에 있을 때 렌더되는 가로타일 수
    renderLimit: 0.25, // 다음 타일을 렌더하는 리미트
    derenderLimit: 0.5, // 이전 타일을 없애는 리미트
  },
  screen: {
    size: [0, 0],
    offset: [0, 0],
  },
  status: "none",
  setKey: (key: types.KeyType, keyState: boolean) =>
    set((state) => {
      const keyboard = state.keyboard;
      keyboard[key] = keyState;
      return { keyboard };
    }),
  changeScreenSize: (screen: types.Screen) => set({ screen }),
}));
