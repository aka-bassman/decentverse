import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { ethers } from "ethers";
import { isMobile } from "react-device-detect";

import { devtools } from "zustand/middleware";

const METAMASK_NETWORK_MAINNET = "1";
const METAMASK_NETWORK_ROPSTEN = "3";

export interface WorldState {
  characterList: types.Character[];
  scope: types.WorldScope;
  render: types.WorldRender;
  map?: types.Map;
  me: types.Player;
  renderMe: types.RenderCharacter;
  myChat: string;
  otherPlayerIds: string[];
  otherPlayers: Map<string, types.OtherPlayer>;
  interaction: types.InteractionState;
  loginMethod: "metamask" | "kaikas" | "guest" | "none";
  isWebviewOpen: boolean;
  configuration: types.Configuration;
  loader: types.LoadManager;
  status: "none" | "loading" | "failed" | "idle";
  initWorld: () => Promise<void>;
  setupConfiguration: (configuration: types.Configuration) => void;
  openWebview: () => void;
  closeWebview: () => void;
  isLoaded: () => boolean;
  loaded: () => void;
  percentage: () => number;
  loadingStatus: () => void;
  goBackSelectLoginMethod: () => void;
  selectCharacter: (character: types.Character) => void;
  setNickname: (nickname: string) => void;
  setOtherPlayerIds: (ids: string[]) => void;
  addOtherPlayers: (players: types.OtherPlayer[]) => void;
  joinInteraction: (
    type: types.scalar.InteractionType,
    int: types.scalar.CallRoom | types.scalar.Webview | types.scalar.Collision
  ) => void;
  leaveInteraction: (type: types.scalar.InteractionType) => void;
  speakChat: (chatText: string) => void;
  connectKaikas: () => Promise<void>;
  connectMetamask: () => Promise<void>;
  loginAsGuest: () => void;
}
export const useWorld = create<WorldState>((set, get) => ({
  me: {
    id: "",
    nickname: "",
    type: "guest",
    character: types.defaultCharacter,
    maxSpeed: 10,
    acceleration: 1,
    deceleration: 1,
  },
  renderMe: {
    position: [5000, 5000],
    velocity: [0, 0],
    state: "idle" as "idle" | "walk",
    direction: "right",
  },
  isWebviewOpen: false,
  myChat: "",
  otherPlayerIds: [],
  otherPlayers: new Map(),
  scope: {
    min: [0, 0],
    max: [2048, 2048],
  },
  render: {
    tiles: [],
    players: {},
  },
  interaction: types.defaultInteractionState,
  status: "none",
  loader: {
    loaded: 0,
    totalLoad: 0,
  },
  characterList: [],
  configuration: types.defaultConfiguration,
  loginMethod: "none",
  openWebview: () => set({ isWebviewOpen: true }),
  closeWebview: () => set({ isWebviewOpen: false }),
  selectCharacter: (character: types.Character) => set((state) => ({ me: { ...state.me, character } })),
  isLoaded: () => {
    const { loader } = get();
    if (!loader.totalLoad) return false;
    return loader.loaded === loader.totalLoad;
  },
  percentage: () => {
    const { loader } = get();
    const percentage = Math.floor((loader.loaded / loader.totalLoad) * 100);
    return percentage;
  },
  loaded: () => set((state) => ({ loader: { ...state.loader, loaded: state.loader.loaded + 1 } })),

  initWorld: async () => {
    const { maps } = await gql.world();
    const { me } = get();

    const token = await gql.signinUser(me.id);
    localStorage.setItem("currentUser", token ?? "null");
    me.id && (await gql.updateUser(me.id, { nickname: me.nickname, address: me.address }));
    let length = 0;
    maps[0].tiles.map((tileArr) =>
      tileArr.map((tile) => {
        tile.top && (length = length + 1);
        tile.bottom && (length = length + 1);
        tile.lighting && (length = length + 1);
      })
    );
    maps[0]?.placements.map((placement) => {
      placement.asset.top !== null && (length = length + 1);
      placement.asset.lighting !== null && (length = length + 1);
      placement.asset.bottom !== null && (length = length + 1);
    });

    const renderMe = {
      position: [5000, 5000],
      velocity: [0, 0],
      state: "idle",
      direction: "right",
    } as any;

    const render = { tiles: maps[1].tiles, players: {} };
    return set((state) => ({
      map: maps[1],
      renderMe,
      render,
      status: "idle",
      loader: {
        loaded: 0,
        totalLoad: length,
      },
      me: { ...state.me, character: state.me.character ?? types.defaultCharacter },
    }));
  },
  loadingStatus: () => {
    set({ status: "loading" });
  },

  goBackSelectLoginMethod: () =>
    set((state) => ({ me: { ...state.me, nickname: "", id: "", address: undefined }, loginMethod: "none" })),
  setNickname: (nickname: string) => set((state) => ({ me: { ...state.me, nickname } })),
  setOtherPlayerIds: (ids: string[]) => set({ otherPlayerIds: ids }),
  addOtherPlayers: (players: types.OtherPlayer[]) =>
    set((state) => {
      const otherPlayers = new Map(state.otherPlayers);
      players.map((player) => {
        if (!otherPlayers.get(player.id)) otherPlayers.set(player.id, player);
      });
      return { otherPlayers };
    }),
  joinInteraction: (
    type: types.scalar.InteractionType,
    int: types.scalar.CallRoom | types.scalar.Webview | types.scalar.Collision
  ) =>
    set((state) => {
      const interaction: any = state.interaction;
      interaction[type] = int;
      return { interaction: { ...interaction } };
    }),
  leaveInteraction: (type: types.scalar.InteractionType) =>
    set((state) => {
      const interaction: any = state.interaction;
      interaction[type] = null;
      return { interaction: { ...interaction } };
    }),
  speakChat: (chatText: string) => set((state) => ({ myChat: chatText })),
  setupConfiguration: (configuration: types.Configuration) => set((state) => ({ configuration })),

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
      set((state) => ({ me: { ...state.me, ...user, type: "user" }, loginMethod: "metamask" }));
    }
  },
  connectKaikas: async () => {
    const { configuration } = get();
    if (!configuration.kaikas) return window.alert("유효한 컨트랙 주소가 없습니다.");

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
      set((state) => ({ me: { ...state.me, ...user, type: "user" }, loginMethod: "kaikas" }));
      const tokenList = await gql.getUserTokenList(account, configuration.kaikas.address);
      let characters = await gql.characters({ tokenId: { $in: tokenList } }, 0, 0);
      if (!characters.length) {
        const tokenId = Math.floor(Math.random() * 1000);
        characters = await gql.characters({ tokenId: { $in: [tokenId, tokenId + 1] } }, 0, 3);
      }
      set((state) => ({ characterList: characters }));

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
      me: {
        ...state.me,
        nickname: `Guest#${Math.floor(Math.random() * 1000)}`,
      },
    })),
}));
