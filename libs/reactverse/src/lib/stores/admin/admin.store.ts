import create from "zustand";
import * as types from "./admin.types";
export interface AdminState {
  admin?: types.Admin;
  status: "none" | "loading" | "failed" | "idle";
}
export const useAdmin = create<AdminState>((set) => ({
  status: "none",
  setAdmin: (admin: types.Admin) => set({ admin }),
}));
