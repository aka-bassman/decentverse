import { RootState } from "../redux";
export const SLICE_NAME = "asset";

export interface AssetState {
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: AssetState = {
  status: "none",
};
export const select = {
  assetStatus: (state: RootState) => state.asset.status,
};
