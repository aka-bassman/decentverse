import create from "zustand";
import * as types from "./dialog.types";
import * as gql from "../gql";
export interface DialogState {
  dialogs: types.Dialog[];
  status: "none" | "loading" | "failed" | "idle";
  initDialogs: () => Promise<void>;
}
export const useDialog = create<DialogState>((set) => ({
  dialogs: [],
  status: "none",
  setDialogs: (dialogs: types.Dialog[]) => set({ dialogs }),
  initDialogs: async () => {
    const dialogs = await gql.dialogs();
    set({ dialogs });
  },
}));
