import create from "zustand";
import * as types from "./asset.types";
export interface AssetState {
  assets: types.Asset[];
  status: "none" | "loading" | "failed" | "idle";
}
export const useAsset = create<AssetState>((set) => ({
  assets: [],
  status: "none",
  setAssets: (assets: types.Asset[]) => set({ assets }),
}));
