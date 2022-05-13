import { RootState } from "../redux";
import * as types from "../types";
export const SLICE_NAME = "character";

export interface CharacterState {
  characters: types.Character[];
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: CharacterState = {
  characters: [],
  status: "none",
};
export const select = {
  characterStatus: (state: RootState) => state.character.status,
};
