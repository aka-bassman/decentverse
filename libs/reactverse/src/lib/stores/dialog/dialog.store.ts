import create from "zustand";
import * as types from "./dialog.types";
export interface DialogState {
  dialogs: types.Dialog[];
  status: "none" | "loading" | "failed" | "idle";
}
export const useDialog = create<DialogState>((set) => ({
  dialogs: [],
  status: "none",
  setDialogs: (dialogs: types.Dialog[]) => set({ dialogs }),
}));
