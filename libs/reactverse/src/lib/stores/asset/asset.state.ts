import * as types from "../types";
import { RootState } from "../redux";
export const SLICE_NAME = "asset";

export interface AssetState {
  assets: types.Asset[];
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: AssetState = {
  assets: [],
  status: "none",
};
export const select = {
  assets: (state: RootState) => state.asset.assets,
  assetStatus: (state: RootState) => state.asset.status,
};
