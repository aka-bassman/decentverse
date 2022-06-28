// import create from "zustand";
import { GetState, SetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorState, EditorSlice } from "./editor.store";

export interface EditorCharacterState {
  isCharacterModalOpen: boolean;
  characterNameInput: string;
  characters: types.TCharacter[];
  selectedCharacterIndex: number;
  // toggleCharacterModalOpen: () => void;
  openCharacterModal: () => Promise<void>;
  closeCharacterModal: () => void;
  setCharacterNameInput: (name: string) => void;
  addCharacter: () => void;
  setSelectedCharacterIndex: (index: number) => void;
}

export const editorCharacterSlice: EditorSlice<EditorCharacterState> = (set, get) => ({
  isCharacterModalOpen: false,
  characterNameInput: "",
  characters: [{ name: "None" }],
  selectedCharacterIndex: 0,
  // toggleCharacterModalOpen: () => {
  //   set((state) => ({ isCharacterModalOpen: !state.isCharacterModalOpen }));
  // },
  openCharacterModal: async () => {
    // const characters = gql.characters();
    set((state) => ({ isCharacterModalOpen: true }));
  },
  closeCharacterModal: () => {
    set((state) => ({ isCharacterModalOpen: false }));
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
  setSelectedCharacterIndex: (index) => {
    set((state) => ({ selectedCharacterIndex: index }));
  },
});
