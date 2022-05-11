import { RootState } from "../redux";
export const SLICE_NAME = "world";

export type WorldQuery = {
  min: number[];
  max: number[];
  serialized: string;
};

export type Screen = {
  size: number[];
  offset: number[];
};
export type WorldRender = {
  tiles: any[];
  players: any[];
};

export interface WorldState {
  query: WorldQuery;
  screen: Screen;
  render: WorldRender;
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: WorldState = {
  query: {
    min: [0, 0],
    max: [0, 0],
    serialized: "00",
  },
  screen: {
    size: [0, 0],
    offset: [0, 0],
  },
  render: {
    tiles: [],
    players: [],
  },
  status: "none",
};
export const select = {
  worldStatus: (state: RootState) => state.world.status,
  screen: (state: RootState) => state.world.screen,
};
