import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { devtools } from "zustand/middleware";

export interface WorldState {
  scope: types.WorldScope;
  render: types.WorldRender;
  map?: types.Map;
  me: types.Player;
  otherPlayerIds: string[];
  otherPlayers: Map<string, types.OtherPlayer>;
  initWorld: () => Promise<void>;
  accelMe: (keyboard: types.Keyboard) => void;
  moveMe: () => void;
  setOtherPlayerIds: (ids: string[]) => void;
  addOtherPlayers: (players: types.OtherPlayer[]) => void;
  status: "none" | "loading" | "failed" | "idle";
}
export const useWorld = create<WorldState>((set, get) => ({
  me: {
    userId: `${Math.random()}`,
    character: {
      id: "",
      tokenId: 0,
      status: "active",
      file: {
        id: "",
        url: "/sprite5.png",
      },
      tileSize: [129, 194],
      totalSize: [388, 581],
      right: {
        idle: {
          row: 2,
          column: 1,
          duration: 300,
        },
        walk: {
          row: 2,
          column: 3,
          duration: 300,
        },
      },
      left: {
        idle: {
          row: 2,
          column: 1,
          duration: 300,
        },
        walk: {
          row: 2,
          column: 3,
          duration: 300,
        },
      },
      up: {
        idle: {
          row: 1,
          column: 1,
          duration: 300,
        },
        walk: {
          row: 1,
          column: 3,
          duration: 300,
        },
      },
      down: {
        idle: {
          row: 0,
          column: 1,
          duration: 300,
        },
        walk: {
          row: 0,
          column: 3,
          duration: 300,
        },
      },
    },
    maxSpeed: 10,
    acceleration: 1,
    deceleration: 1,
    render: {
      id: "",
      position: [0, 0],
      velocity: [0, 0],
      state: "idle",
      direction: "right",
    },
  },
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
  status: "none",
  initWorld: async () => {
    const {
      maps,
      // , characters
    } = await gql.world();
    const me: types.Player = {
      userId: "userId",
      character: get().me.character,
      render: {
        id: "AAAA",
        position: [50, 50],
        velocity: [0, 0],
        state: "idle",
        direction: "right",
      },
      maxSpeed: 10,
      acceleration: 1,
      deceleration: 1,
    };
    const render = { tiles: maps[0].tiles, players: {} };
    const status = "idle";
    return set({ map: maps[0], me, render, status });
  },
  accelMe: (keyboard: types.Keyboard) => {
    const state: WorldState = get();
    if (!state.me) return;
    // const decelSpeed = [
    //   Math.min(Math.abs(state.me.render.velocity[0]), state.me.deceleration),
    //   Math.min(Math.abs(state.me.render.velocity[1]), state.me.deceleration),
    // ];
    // const deceleration = [
    //   state.me.render.velocity[0] > 0 ? -decelSpeed[0] : decelSpeed[0],
    //   state.me.render.velocity[1] > 0 ? -decelSpeed[1] : decelSpeed[1],
    // ];
    // const acceleration = [
    //   keyboard.right ? state.me.acceleration : keyboard.left ? -state.me.acceleration : deceleration[0],
    //   keyboard.down ? state.me.acceleration : keyboard.up ? -state.me.acceleration : deceleration[1],
    // ];
    // const velocity = [state.me.render.velocity[0] + acceleration[0], state.me.render.velocity[1] + acceleration[1]];
    // state.me.render.velocity = [
    //   Math.abs(velocity[0]) < state.me.maxSpeed
    //     ? velocity[0]
    //     : velocity[0] > 0
    //     ? state.me.maxSpeed
    //     : -state.me.maxSpeed,
    //   Math.abs(velocity[1]) < state.me.maxSpeed
    //     ? velocity[1]
    //     : velocity[1] > 0
    //     ? state.me.maxSpeed
    //     : -state.me.maxSpeed,
    // ];
    const velocity = [
      keyboard.right ? state.me.maxSpeed : keyboard.left ? -state.me.maxSpeed : 0,
      keyboard.down ? state.me.maxSpeed : keyboard.up ? -state.me.maxSpeed : 0,
    ];
    const position = [state.me.render.position[0] + velocity[0], state.me.render.position[1] + velocity[1]];
    const characterState = velocity[0] === 0 && velocity[1] === 0 ? "idle" : "walk";
    const direction = keyboard.right
      ? "right"
      : keyboard.left && state.me.character.left
      ? "left"
      : keyboard.up && state.me.character.up
      ? "up"
      : keyboard.down && state.me.character.down
      ? "down"
      : state.me.render.direction;
    return set({
      me: { ...state.me, render: { id: state.me.render.id, position, velocity, direction, state: characterState } },
    });
  },
  moveMe: () => {
    const state = get();
    if (!state.me) return;
    const position = [
      state.me.render.position[0] + state.me.render.velocity[0],
      state.me.render.position[1] + state.me.render.velocity[1],
    ];
    return set({ me: { ...state.me, render: { ...state.me.render, position } } });
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
}));
