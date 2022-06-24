// import create from "zustand";
import { GetState, SetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorState, EditorSlice } from "./editor.store";

export interface EditorDialogState {
  isDialogModalOpen: boolean;
  characterNameInput: string;
  characters: types.TCharacter[];
  // selectedCharacter?: types.TCharacter;
  selectedCharacterIndex: number;
  inputTitle: string;
  inputFlowText: string;
  inputAvatarPosition: types.TAvatarPosition;
  flows: types.TFlow[];
  toggleDialogModalOpen: () => void;
  addFlow: () => void;
  addDialog: () => Promise<void>;
  setInputTitle: (title: string) => void;
  setCharacterNameInput: (name: string) => void;
  addCharacter: () => void;
  // selectCharacter: (index: number) => void;
  setSelectedCharacterIndex: (index: number) => void;
  setInputFlowText: (text: string) => void;
  setInputAvatarPosition: (position: types.TAvatarPosition) => void;
}

export const editorDialogSlice: EditorSlice<EditorDialogState> = (set, get) => ({
  isDialogModalOpen: false,
  characterNameInput: "",
  characters: [{ name: "None" }],
  // selectedCharacter: undefined,
  inputTitle: "",
  inputFlowText: "",
  inputAvatarPosition: "left",
  selectedCharacterIndex: 0,
  flows: [],
  toggleDialogModalOpen: () => {
    set((state) => ({ isDialogModalOpen: !state.isDialogModalOpen }));
  },
  addFlow: () => {
    if (!get().inputFlowText) return;
    const newFLow = {
      avatarPositions: get().inputAvatarPosition,
      text: get().inputFlowText,
      characterIndex: get().selectedCharacterIndex,
    };
    set((state) => ({ flows: [...state.flows, newFLow], inputFlowText: "" }));
  },
  addDialog: async () => {
    console.log("addDialog");
    const title = get().inputTitle;
    const characters = ["627ab7b50438d4ceae0f2f56"];
    const flows: scalar.Flow[] = get().flows.map((cur, index) => ({
      avatarPosition: cur.avatarPositions,
      name: get().characters[cur.characterIndex].name,
      position: [0, 0],
      style: "speak" as scalar.FlowStyle,
      subject: "",
      text: cur.text,
    }));

    const dialogInput = { title, characters, flows };
    await gql.createDialog(dialogInput);
  },
  setInputTitle: (title) => {
    set({ inputTitle: title });
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
  // selectCharacter: (index) => {
  //   set((state) => ({ selectedCharacter: state.characters[index] }));
  // },
  setSelectedCharacterIndex: (index) => {
    set((state) => ({ selectedCharacterIndex: index }));
  },
  setInputFlowText: (text) => {
    set({ inputFlowText: text });
  },
  setInputAvatarPosition: (position) => {
    set({ inputAvatarPosition: position });
  },
});
