import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { isMobile } from "react-device-detect";
import { useWorld } from "../world";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    klaytn?: any;
  }
}
export interface UserState {
  loginMethod: "metamask" | "kaikas" | "guest" | "none";
  type: "user" | "admin";
  user: types.User;
  characters: types.Character[];
  whoAmI: () => Promise<void>;
  connectMetamask: () => Promise<void>;
  connectKaikas: () => Promise<void>;
  loginAsGuest: () => void;
  skipLoginProcess: () => void;
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
      set({ user: { ...user } });
    }
  },
  connectMetamask: async () => {
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
      set({ user: { ...user } });
    }
  },
  connectKaikas: async () => {
    if (isMobile) {
      return window.alert("PC로 진행해주세요.");
    }
    if (!window.klaytn) {
      // return window.alert(t("exception_kaikas-not-found"));
      return window.alert("Kaikas를 다운로드 해주세요.");
    }
    const account = (await window.klaytn.enable())[0];

    if (account) {
      console.log(account);
      // const option = {
      //   headers: [
      //     {
      //       name: "Authorization",
      //       value: `Basic ${Buffer.from(`${this.network.accessKeyId}:${this.network.secretAccessKey}`).toString(
      //         "base64"
      //       )}`,
      //     },
      //     { name: "x-chain-id", value: this.network.chainId },
      //   ],
      //   keepAlive: false,
      // };
      // this.caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));
      // const caver = new Caver();

      // const provider = new ethers.providers.Web3Provider(window.klaytn as any);
      // const message = `test messgae\n timeStmap:${new Date().getTime()}`;
      // const params = [message, selectedAddress[0]];
      // const signAddress = await window.klaytn.request<string>({
      //   method: "personal_sign",
      //   params,
      // });
      // console.log(window.klaytn);
      // const signedAddress = window.klaytn.sign("test", account);
      // console.log(signedAddress);
      // if (!signAddress || !selectedAddress[0]) return;
      // const user = await gql.whoAmI(selectedAddress[0], message, signAddress);
      // set({ id: user.id, address: user.address, nickname: user.nickname, isGuest: false });
    }
  },

  loginAsGuest: () =>
    set((state) => ({
      loginMethod: "guest",
      user: { ...state.user, nickname: `Guest#${Math.floor(Math.random() * 1000000)}` },
    })),
  skipLoginProcess: () => {
    const nickname = `Guest#${Math.floor(Math.random() * 1000000)}`;
    set((state) => ({
      user: { ...state.user, nickname },
    }));
    console.log(5);

    const user: types.User = {
      id: "",
      nickname,
    };

    // if (user.id === "") return;
    // await gql.updateUser(user.id, user);
  },
  logout: () => set((state) => ({ user: types.defaultUser, loginMethod: "none" })),
  updateUser: async () => {
    const { user } = get();
    if (user.id === "") return;
    await gql.updateUser(user.id, user);
  },
  setNickname: (nickname: string) => set((state) => ({ user: { ...state.user, nickname } })),
}));
