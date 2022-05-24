import create from "zustand";
import * as types from "./admin.types";
import * as gql from "../gql";
import { setLink } from "../apollo";

export interface AdminState {
  me?: types.Admin;
  admins: types.Admin[];
  init: () => Promise<void>;
  signinAdmin: (accountId: string, password: string) => Promise<void>;
  signout: () => void;
  createAdmin: (data: types.AdminInput) => Promise<void>;
  updateAdmin: (adminId: string, data: types.AdminInput) => Promise<void>;
  removeAdmin: (adminId: string) => Promise<void>;
  status: "loading" | "idle";
}
export const useAdmin = create<AdminState>((set) => ({
  admins: [],
  status: "loading",
  init: async () => {
    setLink();
    const me = await gql.me();
    set({ me, status: "idle" });
  },
  signinAdmin: async (accountId: string, password: string) => {
    const token = (await gql.signinAdmin(accountId, password))?.accessToken;
    if (!token) return;
    localStorage.setItem("currentUser", token);
    setLink();
    const me = await gql.me();
    set({ me });
  },
  signout: () => {
    localStorage.removeItem("currentUser");
    set({ me: undefined });
  },
  createAdmin: async (data: types.AdminInput) => {
    const admin = await gql.createAdmin(data);
    if (!admin) return;
    return set((state) => ({ admins: [...state.admins, admin] }));
  },
  updateAdmin: async (adminId: string, data: types.AdminInput) => {
    const admin = await gql.updateAdmin(adminId, data);
    if (!admin) return;
    return set((state) => ({ admins: [admin, ...state.admins.filter((a) => a.id !== admin.id)] }));
  },
  removeAdmin: async (adminId: string) => {
    const admin = await gql.removeAdmin(adminId);
    if (!admin) return;
    return set((state) => ({ admins: [...state.admins.filter((a) => a.id !== admin.id)] }));
  },
}));
