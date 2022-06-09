import create from "zustand";
import * as types from "./admin.types";
import * as gql from "../gql";
import { setLink } from "../apollo";

export interface AdminState {
  me?: types.Admin;
  admins: types.Admin[];
  isShowAdminModal: boolean;
  adminView: string;
  init: () => Promise<void>;
  signinAdmin: (accountId: string, password: string) => Promise<void>;
  signout: () => void;
  createAdmin: (data: types.AdminInput) => Promise<void>;
  updateAdmin: (adminId: string, data: types.AdminInput) => Promise<void>;
  removeAdmin: (adminId: string) => Promise<void>;
  toggleShowAdminModal: () => void;
  setAdminView: (viewName: string) => void;
  status: "loading" | "idle";
}
export const useAdmin = create<AdminState>((set) => ({
  admins: [],
  status: "loading",
  isShowAdminModal: false,
  adminView: "signIn",
  init: async () => {
    if (!localStorage.getItem("currentUser")) return;
    setLink();
    const me = await gql.me();
    const adminView = me ? "info" : "signIn";
    set({ me, adminView, status: "idle" });
  },
  signinAdmin: async (accountId: string, password: string) => {
    const token = (await gql.signinAdmin(accountId, password))?.accessToken;
    if (!token) return;
    localStorage.setItem("currentUser", token);
    setLink();
    const me = await gql.me();
    set({ me, adminView: "info" });
  },
  signout: () => {
    localStorage.removeItem("currentUser");
    set({ me: undefined, adminView: "signIn" });
  },
  createAdmin: async (data: types.AdminInput) => {
    const admin = await gql.createAdmin(data);
    if (!admin) return;
    return set((state) => ({ admins: [...state.admins, admin], adminView: "signIn" }));
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
  toggleShowAdminModal: () => {
    set((state) => ({ isShowAdminModal: !state.isShowAdminModal }));
  },
  setAdminView: (viewName) => {
    set({ adminView: viewName });
  },
}));
