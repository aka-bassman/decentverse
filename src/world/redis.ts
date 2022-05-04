import { createClient, RedisClientType } from "redis";

export interface RedisOptions {
  url?: string;
  username?: string;
  password?: string;
}
export const characterStateTypes = [
  "LEFTIDLE",
  "RIGHTIDLE",
  "UPIDLE",
  "DOWNIDLE",
  "LEFTMOVE",
  "RIGHTMOVE",
  "UPMOVE",
  "DOWNMOVE",
] as const;
export type CharacterStateType = typeof characterStateTypes[number];
export const CHARSTATE: { [key in CharacterStateType]: number } = {
  LEFTIDLE: 1,
  RIGHTIDLE: 2,
  UPIDLE: 3,
  DOWNIDLE: 4,
  LEFTMOVE: 5,
  RIGHTMOVE: 6,
  UPMOVE: 7,
  DOWNMOVE: 8,
} as const;
// export type CharacterState =
export interface CharacterData {
  id: string;
  x: number;
  y: number;
  state: typeof CHARSTATE[CharacterStateType];
}

export class Rtdb {
  client?: RedisClientType;
  constructor() {}
  async init(options?: RedisOptions): Promise<boolean> {
    this.client = createClient(options);
    this.client.on("error", (err) => console.log("Redis Client Error", err));
    await this.client.connect();
    return true;
  }
  async update({ id, x, y, state }: CharacterData): Promise<boolean> {
    if (!this.client) return false;
    await this.client.geoAdd(id, { latitude: 0, longitude: 0, member: "f" });
  }
}

//   await client.set("key", "value");
//   const value = await client.get("key");

export const updateCharacter = async (characterData: CharacterData) => {};
