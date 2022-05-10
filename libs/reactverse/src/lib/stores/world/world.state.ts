import { RootState } from "../redux";
export const SLICE_NAME = "world";

export interface WorldState {
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: WorldState = {
  status: "none",
};
export const select = {
  worldStatus: (state: RootState) => state.world.status,
};
