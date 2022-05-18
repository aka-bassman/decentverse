import * as scalar from "../scalar.type";
import { Character } from "../character/character.types";
export type WorldScope = {
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
  position: number[];
  velocity: number[];
  state: PlayerState;
  direction: Direction;
};
export type Player = {
  userId: string;
  character: Character;
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  render: RenderCharacter;
};
export type WorldRender = {
  tiles: scalar.Tile[][];
  players: { [key: string]: Player };
};
