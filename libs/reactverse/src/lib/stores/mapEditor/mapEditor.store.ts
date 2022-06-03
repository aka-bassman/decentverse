import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";

export type TMainTool = "Map" | "Assets" | "Interaction";

export interface MapEditorState {
  // tileList:
  assetPlacements: types.Placement[];
  // attractionList: ???
  // selectedMap
  // selectedAsset
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
  mainTool: TMainTool;
  subTool: string;
  mapCtx?: CanvasRenderingContext2D;
  assetCtx?: CanvasRenderingContext2D;
  interactionCtx?: CanvasRenderingContext2D;
  actionCtx?: CanvasRenderingContext2D;
  mapData?: types.Map;
  assetsData?: types.Asset[];
  viewMode: string[];
  selectedAssetId?: string;
  isEdited: boolean;
  status: "none" | "loading" | "failed" | "idle";
  init: () => Promise<void>;
  setCtxs: ({
    mapCtx,
    assetCtx,
    interactionCtx,
    actionCtx,
  }: {
    mapCtx: CanvasRenderingContext2D;
    assetCtx: CanvasRenderingContext2D;
    interactionCtx: CanvasRenderingContext2D;
    actionCtx: CanvasRenderingContext2D;
  }) => void;
  onMouseDown: (event: any) => void;
  onMouseUp: (event: any) => void;
  onMouseMove: (event: any) => void;
  onMouseLeave: (event: any) => void;
  previewAsset: (offsetX: number, offsetY: number) => void;
  addAsset: (offsetX: number, offsetY: number) => void;
  removeAsset: (offsetX: number, offsetY: number) => void;
  drawAssetsByList: () => void;
  setMainTool: (item: TMainTool) => void;
  setSubTool: (item: string) => void;
  toggleViewMode: (item: string) => void;
  isActiveViewMode: (item: string) => boolean;
  setSelectedAssetId: (id: string) => void;
  clearActionCanvas: () => void;
  clearAssetCanvas: () => void;
  isAssetAddMode: () => boolean;
  isAssetRemoveMode: () => boolean;
  saveMap: () => void;
}
export const useMapEditor = create<MapEditorState>((set, get) => ({
  assetPlacements: [],
  tileSize: 2000,
  mapWidth: 2000,
  mapHeight: 2000,
  // mainTool: "Map",
  mainTool: "Assets",
  subTool: "Add",
  mapCtx: undefined,
  assetCtx: undefined,
  interactionCtx: undefined,
  actionCtx: undefined,
  mapData: undefined,
  assetsData: [],
  viewMode: ["Grid", "Bottom"],
  selectedAssetId: undefined,
  isEdited: false,
  status: "none",
  init: async () => {
    setLink();
    // const map = await gql.map("62989e5b2efe7546f62c35c1");
    const map = await gql.map("627ab2159ecc5480481c06cf");
    const assets = await gql.assets();
    set({ mapData: map, assetsData: assets });
    console.log("assets---", assets);
  },
  setCtxs: ({ mapCtx, assetCtx, interactionCtx, actionCtx }) => {
    set({ mapCtx, assetCtx, interactionCtx, actionCtx });
  },
  setMainTool: (item) => {
    get().clearActionCanvas();
    set({ mainTool: item, subTool: "Add", selectedAssetId: undefined });
  },
  setSubTool: (item) => {
    get().clearActionCanvas();
    set({ subTool: item, selectedAssetId: undefined });
  },
  onMouseDown: ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    get().isAssetAddMode() && get().addAsset(offsetX, offsetY);
    get().isAssetRemoveMode() && get().removeAsset(offsetX, offsetY);
  },
  onMouseUp: (event) => {
    // console.log("hi-up", event);
  },
  onMouseMove: ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    get().isAssetAddMode() && get().selectedAssetId && get().previewAsset(offsetX, offsetY);
  },
  onMouseLeave: (event) => {
    // console.log("hi-leave", event);
  },
  previewAsset: (offsetX, offsetY) => {
    const { actionCtx, selectedAssetId, assetsData } = get();
    const selectedAsset = assetsData?.find((asset: types.Asset) => asset.id === selectedAssetId);
    if (!actionCtx || !selectedAsset?.top.url) return;
    actionCtx.globalAlpha = 0.4;
    const image = new Image();
    image.src = selectedAsset.top.url;
    image.onload = () => {
      get().clearActionCanvas();
      actionCtx.drawImage(image, offsetX, offsetY, image.width, image.height);
      actionCtx.strokeRect(offsetX, offsetY, image.width, image.height);
    };
  },
  addAsset: (offsetX, offsetY) => {
    const { assetCtx, selectedAssetId, assetsData } = get();
    const selectedAsset = assetsData?.find((asset: types.Asset) => asset.id === selectedAssetId);
    if (!assetCtx || !selectedAsset?.top.url || !selectedAssetId) return;

    const image = new Image();
    image.src = selectedAsset.top.url;
    image.onload = () => {
      assetCtx.drawImage(image, offsetX, offsetY, image.width, image.height);
      // assetCtx.strokeRect(offsetX, offsetY, image.width, image.height);
    };
    const placement = { asset: selectedAssetId, position: [offsetX, offsetY, image.width, image.height] };
    set({ assetPlacements: [...get().assetPlacements, placement], isEdited: true });
  },
  removeAsset: (offsetX, offsetY) => {
    console.log("remove!!", offsetX, offsetY);
    const removeIndex = get().assetPlacements.findIndex(
      (placement: types.Placement) =>
        offsetX > placement.position[0] &&
        offsetX < placement.position[0] + placement.position[2] &&
        offsetY > placement.position[1] &&
        offsetY < placement.position[1] + placement.position[3]
    );
    if (removeIndex === -1) return;
    set((state) => ({
      assetPlacements: [
        ...state.assetPlacements.slice(0, removeIndex),
        ...state.assetPlacements.slice(removeIndex + 1),
      ],
    }));
    get().drawAssetsByList();
  },
  drawAssetsByList: () => {
    get().clearAssetCanvas();
    const { assetCtx, assetsData } = get();
    get().assetPlacements.forEach((placement: types.Placement) => {
      const image = new Image();
      const selectedAsset = assetsData?.find((asset: types.Asset) => asset.id === placement.asset);
      if (!assetCtx || !selectedAsset?.top.url) return;

      image.src = selectedAsset.top.url;
      image.onload = () => {
        assetCtx.drawImage(
          image,
          placement.position[0],
          placement.position[1],
          placement.position[2],
          placement.position[3]
        );
      };
    });
  },
  toggleViewMode: (item) => {
    set((state) => ({
      viewMode: state.viewMode.includes(item)
        ? state.viewMode.filter((cur) => cur !== item)
        : [...state.viewMode, item],
    }));
  },
  isActiveViewMode: (item) => {
    return get().viewMode.includes(item);
  },
  setSelectedAssetId: (id) => {
    get().clearActionCanvas();
    set({ selectedAssetId: id });
  },
  clearActionCanvas: () => {
    const { actionCtx, mapWidth, mapHeight } = get();
    if (!actionCtx) return;
    actionCtx.clearRect(0, 0, mapWidth, mapHeight);
  },
  clearAssetCanvas: () => {
    const { assetCtx, mapWidth, mapHeight } = get();
    if (!assetCtx) return;
    assetCtx.clearRect(0, 0, mapWidth, mapHeight);
  },
  isAssetAddMode: () => {
    return !!(get().mainTool === "Assets" && get().subTool === "Add" && get().selectedAssetId);
  },
  isAssetRemoveMode: () => {
    return !!(get().mainTool === "Assets" && get().subTool === "Remove");
  },
  saveMap: async () => {
    const { isEdited, mapData, assetPlacements } = get();
    if (!isEdited || !mapData) return;
    const { name, tileSize, tiles, interactions } = mapData;
    const data = {
      name,
      tileSize,
      tiles,
      placements: assetPlacements,
      interactions,
    };
    console.log("data", data);

    // await gql.updateMap(mapData.id, data);
  },
}));
