// import create from "zustand";
import { GetState, SetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorState, EditorSlice } from "./editor.store";

export interface EditorMapState {
  mapList: types.Map[];
  isNewModalOpen: boolean;
  isLoadModalOpen: boolean;
  inputName: string;
  loadMapList: () => Promise<void>;
  toggleNewModalOpen: () => void;
  toggleLoadModalOpen: () => void;
  closeMap: () => void;
  updateName: (value: string) => void;
  validationMapCheck: () => boolean;
  createMap: () => Promise<void>;
}

export const editorMapSlice: EditorSlice<EditorMapState> = (set, get) => ({
  mapList: [],
  isNewModalOpen: false,
  isLoadModalOpen: false,
  inputName: "",
  loadMapList: async () => {
    const mapList = await gql.maps();
    set({ mapList });
  },
  toggleNewModalOpen: () => {
    set((state) => ({ isNewModalOpen: !state.isNewModalOpen }));
  },
  toggleLoadModalOpen: () => {
    set((state) => ({ isLoadModalOpen: !state.isLoadModalOpen }));
  },
  closeMap: () => {
    set({ mapData: undefined, assetsData: [] });
  },
  updateName: (value) => {
    set({ inputName: value });
  },
  validationMapCheck: () => {
    return !!get().inputName;
  },
  createMap: async () => {
    if (!get().validationMapCheck()) return;
    const { inputName } = get();

    const data = {
      name: inputName,
      tileSize: 2000,
      collisions: [],
      placements: [],
      tiles: [],
      webviews: [],
      callRooms: [],
    };

    set({ isNewModalOpen: false });

    const newMap = await gql.createMap(data);
    newMap?.id && (await get().init(newMap.id));
  },
});
