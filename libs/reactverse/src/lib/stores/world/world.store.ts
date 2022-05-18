import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";

export interface WorldState {
  scope: types.WorldScope;
  screen: types.Screen;
  render: types.WorldRender;
  map?: types.Map;
  me?: types.Player;
  initWorld: () => Promise<void>;
  accelMe: (keyboard: types.Keyboard) => void;
  moveMe: () => void;
  changeScreenSize: (screen: types.Screen) => void;
  status: "none" | "loading" | "failed" | "idle";
}
export const useWorld = create<WorldState>((set, get) => ({
  me: {
    userId: "",
    character: {
      id: "",
      tokenId: 0,
      status: "active",
      file: {
        id: "",
        url: "",
      },
      tileSize: [418, 626],
      totalSize: [1673, 2505],
      right: {
        idle: {
          row: 0,
          column: 4,
          duration: 1000,
        },
        walk: {
          row: 1,
          column: 4,
          duration: 1000,
        },
      },
      left: {
        idle: {
          row: 2,
          column: 4,
          duration: 1000,
        },
        walk: {
          row: 3,
          column: 4,
          duration: 1000,
        },
      },
    },

    // right?: scalar.Sprite;
    // up?: scalar.Sprite;
    // down?: scalar.Sprite;
    maxSpeed: 5,
    acceleration: 1,
    deceleration: 1,

    render: {
      src: "",
      flip: false,
      position: [0, 0],
      velocity: [0, 0],
      state: "idle",
      direction: "right",
    },
  },
  scope: {
    min: [0, 0],
    max: [0, 0],
    serialized: "00",
  },
  screen: {
    size: [0, 0],
    offset: [0, 0],
  },
  render: {
    tiles: [],
    players: {},
  },
  status: "none",
  initWorld: async () => {
    const { maps, characters } = await gql.world();
    const me: types.Player = {
      userId: "userId",
      character: characters[0],
      render: {
        position: [50, 50],
        velocity: [0, 0],
        state: "idle",
        direction: "right",
      },
      maxSpeed: 5,
      acceleration: 1,
      deceleration: 1,
    };
    const render = { tiles: maps[0].tiles.slice(0, 2).map((tiles) => tiles.slice(0, 2)), players: {} };
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
    return set({ me: { ...state.me, render: { position, velocity, direction, state: characterState } } });
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
  changeScreenSize: (screen: types.Screen) => set({ screen }),
}));
