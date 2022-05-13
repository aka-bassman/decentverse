import { RootState } from "../redux";
import * as types from "../types";
export const SLICE_NAME = "map";

export interface MapState {
  map?: types.Map;
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: MapState = {
  status: "none",
};
export const select = {
  mapStatus: (state: RootState) => state.map.status,
};
