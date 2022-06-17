import * as types from "../types";
import * as gql from "../gql";
import { EditorSlice } from "./editor.store";

export interface EditorTileState {
  isTilesModalOpen: boolean;
  newTiles: types.scalar.TileInput[][];
  toggleTilesModalOpen: () => void;
  addMapFile: (file: any, type: "bottom" | "top" | "lighting") => Promise<void>;
  validationTileCheck: () => boolean;
  addTiles: () => Promise<void>;
}
export const editorTileSlice: EditorSlice<EditorTileState> = (set, get) => ({
  isTilesModalOpen: false,
  newTiles: [],
  toggleTilesModalOpen: () => {
    set((state) => ({ isTilesModalOpen: !state.isTilesModalOpen }));
  },
  addMapFile: async (file, type) => {
    const mapData = get().mapData;
    if (!mapData) return;
    const imageFiles = await gql.addMapFile(file, mapData.name);
    const newItem = {
      bottom: undefined,
      top: undefined,
      lighting: undefined,
      collisions: [],
      webviews: [],
      callRooms: [],
    };

    let newTiles: types.scalar.TileInput[][] = JSON.parse(JSON.stringify(get().newTiles));

    imageFiles?.forEach((cur) => {
      const indexText = cur.url.split(mapData.name)[1].split("/")[1].split("-");
      const [heightIndex, widthIndex] = [Number(indexText[0]), Number(indexText[1])];
      if (!newTiles[widthIndex]) newTiles[widthIndex] = [];
      if (!newTiles[widthIndex][heightIndex]) newTiles[widthIndex][heightIndex] = newItem;
      newTiles = JSON.parse(JSON.stringify(newTiles));
      newTiles[widthIndex][heightIndex][type] = cur.id;
    });

    set({ newTiles });
  },
  validationTileCheck: () => {
    return !!get().newTiles?.[0]?.[0]?.bottom;
  },
  addTiles: async () => {
    const { mapData, newTiles } = get();
    if (!mapData) return;

    const data = {
      name: mapData.name,
      tileSize: mapData.tileSize,
      tiles: newTiles,
      placements: mapData.placements,
      collisions: mapData.collisions,
      webviews: mapData.webviews,
      callRooms: mapData.callRooms,
    };

    console.log("data!!!!", data);

    await gql.updateMap(mapData.id, data);
    set({ newTiles: [], isTilesModalOpen: false });

    mapData?.id && (await get().init(mapData.id));
  },
});
