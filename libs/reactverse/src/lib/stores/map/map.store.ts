import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";

export interface MapState {
  map?: types.Map;
  status: "none" | "loading" | "failed" | "idle";
}
export const useMap = create<MapState>((set, get) => ({
  status: "none",
  initMap: async () => {
    const maps = await gql.maps();
    if (!maps.length) return;
    set({ map: maps[0] });
  },
}));
