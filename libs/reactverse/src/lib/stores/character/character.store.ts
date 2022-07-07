import create from "zustand";
import * as types from "./character.types";
export interface CharacterState {
  characters: types.Character[];
  status: "none" | "loading" | "failed" | "idle";
}
export const useCharacter = create<CharacterState>((set) => ({
  characters: [],
  status: "none",
  setCharacters: (characters: types.Character[]) => set({ characters }),
}));
