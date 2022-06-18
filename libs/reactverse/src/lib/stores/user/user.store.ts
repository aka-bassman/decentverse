import create from "zustand";
import * as types from "./user.types";
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
  id?: string;
  nickname: string;
  address: string;
  isGuest: boolean;
  type: "user" | "admin";
  whoAmI: () => Promise<void>;
  guest: () => void;
  logout: () => void;
  updateUser: (data: Partial<types.UserInput>) => Promise<void>;
  setName: (nickname: string) => void;
  status: "loading" | "idle";
}
export const useUser = create<UserState>((set, get) => ({
  nickname: "",
  address: "",
  isGuest: true,
  type: "user",
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
      set({ id: user.id, address: user.address, nickname: user.nickname, isGuest: false });
    }
  },
  guest: () => {
    set({ isGuest: true });
  },
  logout: () => {
    set({ nickname: "", address: "" });
  },
  updateUser: async (data: types.UserInput) => {
    const me = get();
    if (!me.id) return;
    await gql.updateUser(me?.id, data);
  },
  setName: (nickname: string) => set({ nickname }),
}));
