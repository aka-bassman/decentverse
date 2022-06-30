import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";

import { devtools } from "zustand/middleware";

const METAMASK_NETWORK_MAINNET = "1";
const METAMASK_NETWORK_ROPSTEN = "3";

export interface WorldState {
  scope: types.WorldScope;
  render: types.WorldRender;
  map?: types.Map;
  me: types.Player;
  renderMe: types.RenderCharacter;
  myChat: string;
  otherPlayerIds: string[];
  otherPlayers: Map<string, types.OtherPlayer>;
  interaction: types.InteractionState;
  modalOpen: boolean;
  initWorld: () => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
  isLoaded: () => boolean;
  loaded: () => void;
  percentage: () => number;
  loadingStatus: () => void;
  selectCharacter: (character: types.Character) => void;
  setOtherPlayerIds: (ids: string[]) => void;
  addOtherPlayers: (players: types.OtherPlayer[]) => void;
  joinInteraction: (
    type: types.scalar.InteractionType,
    int: types.scalar.CallRoom | types.scalar.Webview | types.scalar.Collision
  ) => void;
  leaveInteraction: (type: types.scalar.InteractionType) => void;
  speakChat: (chatText: string) => void;
  loader: types.LoadManager;

  status: "none" | "loading" | "failed" | "idle";
}
export const useWorld = create<WorldState>((set, get) => ({
  me: {
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
  modalOpen: false,
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
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
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

    let length = 0;
    maps[1].tiles.map((tileArr) =>
      tileArr.map((tile) => {
        tile.top && (length = length + 1);
        tile.bottom && (length = length + 1);
        tile.lighting && (length = length + 1);
      })
    );
    maps[1]?.placements.map((placement) => {
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
}));
