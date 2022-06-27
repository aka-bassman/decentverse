import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
export interface UserState {
  loginMethod: "metamask" | "kaikas" | "guest" | "none";
  type: "user" | "admin";
  user: types.User;
  characters: types.Character[];
  whoAmI: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateUser: () => Promise<void>;
  setNickname: (nickname: string) => void;
  status: "loading" | "idle";
}
export const useUser = create<UserState>((set, get) => ({
  loginMethod: "none",
  type: "user",
  user: types.defaultUser,
  characters: [],
  status: "loading",
  whoAmI: async () => {
    if (typeof window.ethereum === "undefined") return;
    const selectedAddress = await window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
    if (selectedAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const message = `test messgae\n timeStmap:${new Date().getTime()}`;
      const params = [message, selectedAddress[0]];
      const signAddress = await window.ethereum.request<string>({
        method: "personal_sign",
        params,
      });
      if (!signAddress || !selectedAddress[0]) return;
      const user = await gql.whoAmI(selectedAddress[0], message, signAddress);
      const characters = await gql.characters({}, 0, 6);
      set({ user, loginMethod: "metamask", characters });
    }
  },
  loginAsGuest: () =>
    set((state) => ({
      loginMethod: "guest",
      user: { ...state.user, nickname: `Guest#${Math.floor(Math.random() * 1000000)}` },
    })),
  logout: () => set((state) => ({ user: types.defaultUser, loginMethod: "none" })),
  updateUser: async () => {
    const { user } = get();
    if (user.id === "") return;
    await gql.updateUser(user.id, user);
  },
  setNickname: (nickname: string) => set((state) => ({ user: { ...state.user, nickname } })),
}));
