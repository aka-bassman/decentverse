import { RootState } from "../redux";
export const SLICE_NAME = "character";

export interface CharacterState {
  status: "none" | "loading" | "failed" | "idle";
}
export const initialState: CharacterState = {
  status: "none",
};
export const select = {
  characterStatus: (state: RootState) => state.character.status,
};
