// import create from "zustand";
import { GetState, SetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorState, EditorSlice } from "./editor.store";

export interface EditorDialogState {
  isDialogModalOpen: boolean;
  inputTitle: string;
  inputFlowText: string;
  inputAvatarPosition: types.TAvatarPosition;
  flows: types.TFlow[];
  toggleDialogModalOpen: () => void;
  addFlow: () => void;
  addDialog: () => Promise<void>;
  setInputTitle: (title: string) => void;
  setInputFlowText: (text: string) => void;
  setInputAvatarPosition: (position: types.TAvatarPosition) => void;
}

export const editorDialogSlice: EditorSlice<EditorDialogState> = (set, get) => ({
  isDialogModalOpen: false,
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
    const title = get().inputTitle;
    const characters = ["627ab7b50438d4ceae0f2f56"];
    // const flows: scalar.Flow[] = get().flows.map((cur, index) => ({
    //   avatarPosition: cur.avatarPositions,
    //   name: get().characters[cur.characterIndex].name,
    //   position: [0, 0],
    //   style: "speak" as scalar.FlowStyle,
    //   subject: "",
    //   texts: cur.text,
    // }));

    // const dialogInput = { title, characters, flows };
    // await gql.createDialog(dialogInput);
  },
  setInputTitle: (title) => {
    set({ inputTitle: title });
  },
  setInputFlowText: (text) => {
    set({ inputFlowText: text });
  },
  setInputAvatarPosition: (position) => {
    set({ inputAvatarPosition: position });
  },
});
