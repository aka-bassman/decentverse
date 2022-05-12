import { RootState } from "../redux";
export const SLICE_NAME = "map";

export interface MapState {
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: MapState = {
  status: "none",
};
export const select = {
  mapStatus: (state: RootState) => state.map.status,
};
