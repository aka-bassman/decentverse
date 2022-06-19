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
  id: string;
  position: number[];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
};
export type RenderOtherPlayer = {
  id: string;
  position: number[];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
  chatText: string;
  isTalk: boolean;
};
export type Player = {
  userId: string;
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
