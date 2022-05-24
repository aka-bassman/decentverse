import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
export interface MapState {
  map?: types.Map;
  me?: types.Admin;
  status: "none" | "loading" | "failed" | "idle";
}
export const useMap = create<MapState>((set, get) => ({
  status: "none",
  signinAdmin: async (accountId: string, password: string) => {
    const token = await gql.signinAdmin(accountId, password);
    if (!token) return;
    localStorage.setItem("currentUser", token.accessToken);
    setLink();
    const me = await gql.me();
    // set({ map: maps[0] });
  },
}));
