import { RootState } from "../redux";
import * as types from "../types";
export const SLICE_NAME = "world";

export interface WorldState {
  query: types.WorldQuery;
  screen: types.Screen;
  render: types.WorldRender;
  map?: types.Map;
  me?: types.Player;
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
    players: {},
  },
  status: "none",
};
export const select = {
  me: (state: RootState) => state.world.me,
  meRender: (state: RootState) => state.world.me?.render,
  renderTiles: (state: RootState) => state.world.render.tiles,
  renderPlayers: (state: RootState) => state.world.render.players,
  worldStatus: (state: RootState) => state.world.status,
  screen: (state: RootState) => state.world.screen,
};
