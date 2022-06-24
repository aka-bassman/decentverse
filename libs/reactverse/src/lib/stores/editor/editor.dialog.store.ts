// import create from "zustand";
import { GetState, SetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorState, EditorSlice } from "./editor.store";

export interface EditorDialogState {
  isScriptModalOpen: boolean;
  characterNameInput: string;
  characters: types.TCharacter[];
  selectedCharacter?: types.TCharacter;
  toggleScriptModalOpen: () => void;
  addScript: () => Promise<void>;
  setCharacterNameInput: (name: string) => void;
  addCharacter: () => void;
  selectCharacter: (index: number) => void;
}

export const editorDialogSlice: EditorSlice<EditorDialogState> = (set, get) => ({
  isScriptModalOpen: false,
  characterNameInput: "",
  characters: [],
  selectedCharacter: undefined,
  toggleScriptModalOpen: () => {
    set((state) => ({ isScriptModalOpen: !state.isScriptModalOpen }));
  },
  addScript: async () => {
    console.log("addScript");
  },
  setCharacterNameInput: (name) => {
    set({ characterNameInput: name });
  },
  addCharacter: () => {
    if (!get().characterNameInput) return;
    const newCharacter = { name: get().characterNameInput, image: undefined };
    set((state) => ({
      characters: [...state.characters, newCharacter],
      characterNameInput: "",
    }));
  },
  selectCharacter: (index) => {
    set((state) => ({ selectedCharacter: state.characters[index] }));
  },
});
