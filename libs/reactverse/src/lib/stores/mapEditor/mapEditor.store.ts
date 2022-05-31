import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
export interface MapEditorState {
  // tileList:
  // assetList:
  // attractionList: ???
  // selectedMap
  // selectedAsset

  // mainTool :["Map", "Assets", "Interatcion"]
  // subTool :
  viewMode: string[];
  status: "none" | "loading" | "failed" | "idle";
  toggleViewMode: (item: string) => void;
  isActiveViewMode: (item: string) => boolean;
}
export const useMapEditor = create<MapEditorState>((set, get) => ({
  viewMode: ["Grid", "Bottom"],
  status: "none",
  toggleViewMode: (item) => {
    set((state) => ({
      viewMode: state.viewMode.includes(item)
        ? state.viewMode.filter((cur) => cur !== item)
        : [...state.viewMode, item],
    }));
  },
  isActiveViewMode: (item) => {
    return get().viewMode.includes(item);
  },
}));
