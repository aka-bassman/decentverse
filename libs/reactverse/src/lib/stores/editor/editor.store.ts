import create, { SetState, GetState } from "zustand";
import { EditorBaseState, editorBaseSlice } from "./editor.base.store";
import { EditorMapState, editorMapSlice } from "./editor.map.store";
import { EditorTileState, editorTileSlice } from "./editor.tile.store";
import { EditorInteractionState, editorInteractionSlice } from "./editor.interaction.store";
import { EditorDialogState, editorDialogSlice } from "./editor.dialog.store";
import { EditorCharacterState, editorCharacterSlice } from "./editor.character.store";

export type EditorState = EditorBaseState &
  EditorMapState &
  EditorTileState &
  EditorInteractionState &
  EditorDialogState &
  EditorCharacterState;

export type EditorSlice<T> = (set: SetState<EditorState>, get: GetState<EditorState>) => T;

export const useEditor = create<EditorState>((set, get) => ({
  ...editorBaseSlice(set, get),
  ...editorMapSlice(set, get),
  ...editorTileSlice(set, get),
  ...editorInteractionSlice(set, get),
  ...editorDialogSlice(set, get),
  ...editorCharacterSlice(set, get),
}));
