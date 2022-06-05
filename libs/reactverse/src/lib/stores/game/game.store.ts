import create from "zustand";
import * as types from "../types";
import { Socket } from "socket.io-client";

export interface GameState {
  loopInterval: number;
  keyboard: types.Keyboard;
  signalInterval: number;
  ping: number;
  renderTime: number;
  render: {
    cameraPos: number[];
    tiles: number[][];
  };
  tileMap: {
    tileSize: number[];
    lineTileNum: number[];
    maxTileNum: number[];
    renderLimit: number[];
    derenderLimit: number[];
  };
  screen: types.Screen;
  status: "none" | "loading" | "failed" | "idle";
  setKey: (key: types.KeyType, keyState: boolean) => void;
  changeScreenSize: (screen: types.Screen) => void;
  setTiles: (tiles: number[][]) => void;
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
    tiles: [
      [0, 2],
      [0, 2],
    ],
  },
  tileMap: {
    tileSize: [2000, 2000],
    lineTileNum: [3, 3], // 꼭지점에 있을 때 렌더되는 가로타일 수
    maxTileNum: [8, 5],
    renderLimit: [0.3, 0.3], // 다음 타일을 렌더하는 리미트
    derenderLimit: [0.45, 0.45], // 이전 타일을 없애는 리미트
  },
  screen: {
    size: [1000, 1000],
    offset: [1024, 1024],
  },
  status: "none",
  setKey: (key: types.KeyType, keyState: boolean) =>
    set((state) => {
      const keyboard = state.keyboard;
      keyboard[key] = keyState;
      return { keyboard };
    }),
  changeScreenSize: (screen: types.Screen) => set({ screen }),
  setTiles: (tiles: number[][]) => {
    return set((state) => ({ render: { ...state.render, tiles } }));
  },
}));
