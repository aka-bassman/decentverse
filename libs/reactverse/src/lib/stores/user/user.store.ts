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
      const user = await gql.whoAmI(selectedAddress[0]);
      set({ user, loginMethod: "metamask" });
    }
  },
  connectKaikas: async () => {
    const kaskas = useWorld((state) => state.configuration?.kaikas);
    if (!kaskas) return window.alert("유효한 컨트랙 주소가 없습니다.");

    if (isMobile) {
      return window.alert("PC로 진행해주세요.");
    }
    if (!window.klaytn) {
      // return window.alert(t("exception_kaikas-not-found"));
      return window.alert("Kaikas를 다운로드 해주세요.");
    }
    const account = (await window.klaytn.enable())[0];

    if (account) {
      const user = await gql.whoAmI(account);
      set({ user, loginMethod: "kaikas" });
      const tokenList = await gql.getUserTokenList(account, kaskas.address);
      let characters = await gql.characters({ tokenId: { $in: tokenList } }, 0, 0);
      if (!characters.length) {
        const tokenId = Math.floor(Math.random() * 1000);
        characters = await gql.characters({ tokenId: { $in: [tokenId, tokenId + 1] } }, 0, 3);
      }
      set({ characters });

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
      user: {
        ...state.user,
        id: `${Math.floor(Math.random() * 100000)}`,
        nickname: `Guest#${Math.floor(Math.random() * 1000)}`,
      },
    })),
  skipLoginProcess: () => {
    const nickname = `Guest#${Math.floor(Math.random() * 1000)}`;
    set((state) => ({
      user: { ...state.user, nickname },
    }));
  },
  logout: () => set((state) => ({ user: types.defaultUser, loginMethod: "none" })),
  updateUser: async () => {
    const { user, loginMethod } = get();
    if (user.id === "" || loginMethod === "guest") return;
    await gql.updateUser(user.id, { nickname: user.nickname, address: user.address });
  },
  setNickname: (nickname: string) => set((state) => ({ user: { ...state.user, nickname } })),
}));
