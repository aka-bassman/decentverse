import * as scalar from "../scalar.type";
import { Character } from "../character/character.types";
import { types } from "..";
export type WorldScope = {
  min: number[];
  max: number[];
};

export type Screen = {
  size: number[];
  offset: number[];
};

export const playerStates = ["idle", "walk"] as const;
export type PlayerState = typeof playerStates[number];

export const directions = ["left", "right", "up", "down"] as const;
export type Direction = typeof directions[number];
export type RenderCharacter = {
  position: number[];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
};
export type RenderOtherPlayer = {
  id: string;
  nickname: string;
  position: number[];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
  chatText: string;
  isTalk: boolean;
};
export type Player = {
  character: Character;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
};
export type WorldRender = {
  tiles: scalar.Tile[][];
  players: { [key: string]: Player };
};
export type OtherPlayer = {
  id: string;
  user: types.User;
  character: Character;
  updatedAt: number;
};
export type InteractionState = {
  collision: scalar.Collision | null;
  webview: scalar.Webview | null;
  callRoom: scalar.CallRoom | null;
};
export const defaultCharacter = {
  id: "",
  tokenId: 0,
  status: "active",
  file: {
    id: "",
    url: "https://asset.ayias.io/decentverse/character/chinchin.png",
  },
  tileSize: [240, 330],
  totalSize: [388, 581],
  size: [120, 165],
  right: {
    idle: {
      row: 4,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 5,
      column: 4,
      duration: 500,
    },
  },
  left: {
    idle: {
      row: 6,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 7,
      column: 4,
      duration: 500,
    },
  },
  up: {
    idle: {
      row: 2,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 3,
      column: 4,
      duration: 500,
    },
  },
  down: {
    idle: {
      row: 0,
      column: 1,
      duration: 500,
    },
    walk: {
      row: 1,
      column: 4,
      duration: 500,
    },
  },
};
export const defaultRenderCharacter = {
  id: "",
  position: [0, 0],
  velocity: [0, 0],
  state: "idle" as PlayerState,
  direction: "right" as Direction,
};
export const defaultOtherPlayer = {
  id: "default",
  character: defaultCharacter,
  updatedAt: new Date().getTime(),
};
export const defaultInteractionState = {
  collision: null,
  webview: null,
  callRoom: null,
};
