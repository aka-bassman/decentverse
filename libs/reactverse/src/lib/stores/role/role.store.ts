import create from "zustand";
import * as types from "./role.types";
export interface RoleState {
  roles: types.Role[];
  status: "none" | "loading" | "failed" | "idle";
}
export const useRole = create<RoleState>((set) => ({
  roles: [],
  status: "none",
  setRoles: (roles: types.Role[]) => set({ roles }),
}));
