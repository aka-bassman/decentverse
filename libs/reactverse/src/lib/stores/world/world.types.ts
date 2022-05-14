import * as scalar from "../scalar.type";
import { Character } from "../character/character.types";
export type WorldQuery = {
  min: number[];
  max: number[];
  serialized: string;
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
  src: string;
  flip: boolean;
  position: number[];
  velocity: number[];
};
export type Player = {
  userId: string;
  character: Character;
  state: PlayerState;
  direction: Direction;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  render: RenderCharacter;
};
export type WorldRender = {
  tiles: scalar.Tile[][];
  players: { [key: string]: Player };
};
