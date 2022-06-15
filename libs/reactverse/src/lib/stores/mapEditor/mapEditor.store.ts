import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";

export interface MapEditorState {
  isMapEditorOpen: boolean;
  assetPlacements: types.Placement[];
  tileSize: number;
  mapWidth: number; //
  mapHeight: number; //
  mainTool: types.TMainTool;
  subTool: string;
  mapData?: types.Map;
  assetsData?: types.Asset[];
  viewMode: string[];
  selectedAssetId?: string;
  isEdited: boolean;
  preview: types.TPreview;
  collisionPreview: types.TCollisionPreview;
  assets: types.TAsset[];
  collisions: types.TCollision[];
  status: "none" | "loading" | "failed" | "idle";
  init: () => Promise<void>;
  previewAsset: (x: number, y: number) => void;
  addAsset: (x: number, y: number) => void;
  addCollision: () => void;
  previewCollision: (x: number, y: number) => void;
  previewCollisionMove: (x: number, y: number) => void;
  // removeAsset: (x: number, y: number) => void;
  removeAsset: (index: number) => void;
  removeCollision: (index: number) => void;
  setMainTool: (item: types.TMainTool) => void;
  setSubTool: (item: string) => void;
  toggleViewMode: (item: string) => void;
  isActiveViewMode: (item: string) => boolean;
  setSelectedAssetId: (id: string) => void;
  replaceImgUrl: (url: string) => string;
  clearPreview: () => void;
  clearCollisionPreview: () => void;
  isAssetAddMode: () => boolean;
  isAssetRemoveMode: () => boolean;
  isCollisionAddMode: () => boolean;
  isCollisionRemoveMode: () => boolean;
  saveMap: () => void;
  pointerMoveOnTile: (e: any) => void;
  pointerDownOnTile: (e: any) => void;
  clickOnAsset: (e: any, index: number) => void;
  clickOnCollision: (e: any, index: number) => void;
  toggleMapEditorOpen: () => void;
}
export const useMapEditor = create<MapEditorState>((set, get) => ({
  isMapEditorOpen: false,
  assetPlacements: [],
  tileSize: 2000,
  mapWidth: 2000,
  mapHeight: 2000,
  // mainTool: "Map",
  mainTool: "Assets",
  subTool: "Add",
  mapData: undefined,
  assetsData: [], //
  assets: [],
  collisions: [],
  viewMode: ["Interaction", "Assets"],
  selectedAssetId: undefined,
  isEdited: false,
  preview: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isPreview: false,
    image: "",
  },
  collisionPreview: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isPreview: false,
  },
  status: "none",
  init: async () => {
    setLink();
    const mapData = await gql.map("629b51909fd96cc4c6f6adb1");
    // const map = await gql.map("627ab2159ecc5480481c06cf");

    // const assetsData = await gql.assets();
    const assetsData = (await gql.assets()).filter((cur) => !cur.top.url.includes("dev.akamir"));

    const assets = mapData.placements.map((placement: any) => ({
      x: placement.position[0],
      y: placement.position[1],
      width: placement.position[2],
      height: placement.position[3],
      top: placement?.asset?.top?.url ? get().replaceImgUrl(placement.asset.top.url) : "",
      bottom: placement?.asset?.bottom?.url ? get().replaceImgUrl(placement.asset.bottom.url) : "",
      lighting: placement?.asset?.lighting?.url ? get().replaceImgUrl(placement.asset.lighting.url) : "",
      id: placement.asset.id,
    }));

    const collisions = mapData.collisions.map((interaction) => ({
      x: (interaction.topLeft[0] + interaction.bottomRight[0]) / 2,
      y: (interaction.topLeft[1] + interaction.bottomRight[1]) / 2,
      width: Math.abs(interaction.bottomRight[0] - interaction.topLeft[0]),
      height: Math.abs(interaction.bottomRight[1] - interaction.topLeft[1]),
    }));

    set({ mapData, assetsData, assets, collisions });
  },
  setMainTool: (item) => {
    get().clearPreview();
    get().clearCollisionPreview();
    set({ mainTool: item, subTool: "Add", selectedAssetId: undefined });
  },
  setSubTool: (item) => {
    get().clearPreview();
    get().clearCollisionPreview();
    set({ subTool: item, selectedAssetId: undefined });
  },
  previewAsset: (x, y) => {
    const { selectedAssetId, assetsData } = get();
    const selectedAsset = assetsData?.find((asset: types.Asset) => asset.id === selectedAssetId);
    const image = new Image();
    image.src = selectedAsset?.top.url || "";
    const imageSrc = get().replaceImgUrl(selectedAsset?.top.url || "");
    set({
      preview: { x, y, width: image.width, height: image.height, isPreview: true, image: imageSrc },
    });
  },
  addAsset: (x, y) => {
    const { selectedAssetId, assetsData } = get();
    const selectedAsset = assetsData?.find((asset: types.Asset) => asset.id === selectedAssetId);
    if (!selectedAsset?.top.url || !selectedAssetId) return;

    const image = new Image();
    image.src = selectedAsset?.top.url;
    const newAsset = {
      x,
      y,
      width: image.width,
      height: image.height,
      top: selectedAsset?.top?.url ? get().replaceImgUrl(selectedAsset.top.url) : "",
      bottom: selectedAsset?.bottom?.url ? get().replaceImgUrl(selectedAsset.bottom.url) : "",
      lighting: selectedAsset?.lighting?.url ? get().replaceImgUrl(selectedAsset.lighting.url) : "",
      id: selectedAssetId,
    };
    set((state) => ({ assets: [...state.assets, newAsset], isEdited: true }));
  },
  addCollision: () => {
    const { x, y, width, height } = get().collisionPreview;
    const newCollision = { x, y, width, height };

    set((state) => ({
      collisions: [...state.collisions, newCollision],
      collisionPreview: {
        ...state.collisionPreview,
        isPreview: false,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      isEdited: true,
    }));
  },
  previewCollision: (x, y) => {
    if (!get().collisionPreview.isPreview) {
      set((state) => ({
        collisionPreview: { ...state.collisionPreview, isPreview: true, startX: x, startY: y },
      }));
    } else {
      get().addCollision();
    }
  },
  previewCollisionMove: (x, y) => {
    if (!get().collisionPreview.isPreview) return;

    const prevX = get().collisionPreview.startX;
    set((state) => ({
      collisionPreview: {
        ...state.collisionPreview,
        isPreview: true,
        x: (x + state.collisionPreview.startX) / 2,
        y: (y + state.collisionPreview.startY) / 2,
        width: Math.abs(x - state.collisionPreview.startX),
        height: Math.abs(y - state.collisionPreview.startY),
      },
    }));
  },
  replaceImgUrl: (url) => {
    return url.replace("https://asset.ayias.io/", "ayias/");
  },
  removeAsset: (index) => {
    set((state) => ({
      assets: [...state.assets.slice(0, index), ...state.assets.slice(index + 1)],
      isEdited: true,
    }));
  },
  removeCollision: (index) => {
    set((state) => ({
      collisions: [...state.collisions.slice(0, index), ...state.collisions.slice(index + 1)],
      isEdited: true,
    }));
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
    get().clearPreview();
    get().clearCollisionPreview();
    set({ selectedAssetId: id });
  },
  clearPreview: () => {
    set({
      preview: { x: 0, y: 0, width: 0, height: 0, isPreview: false, image: "" },
    });
  },
  clearCollisionPreview: () => {
    set((state) => ({
      collisionPreview: {
        ...state.collisionPreview,
        isPreview: false,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    }));
  },
  isAssetAddMode: () => {
    return !!(get().mainTool === "Assets" && get().subTool === "Add" && get().selectedAssetId);
  },
  isAssetRemoveMode: () => {
    return !!(get().mainTool === "Assets" && get().subTool === "Remove");
  },
  isCollisionAddMode: () => {
    return !!(get().mainTool === "Interaction" && get().subTool === "Add");
  },
  isCollisionRemoveMode: () => {
    return !!(get().mainTool === "Interaction" && get().subTool === "Remove");
  },
  saveMap: async () => {
    const { isEdited, mapData, assets } = get();
    if (!isEdited || !mapData) return;
    const { name, tileSize, tiles, collisions } = mapData;

    const newCollisions = get().collisions.map((collision) => ({
      type: "collision",
      topLeft: [Math.round(collision.x - collision.width / 2), Math.round(collision.y + collision.height / 2)],
      bottomRight: [Math.round(collision.x + collision.width / 2), Math.round(collision.y - collision.height / 2)],
    }));

    let tilesInput = new Array(tiles.length).fill(undefined);
    tilesInput = tilesInput.map((cur) => new Array(tiles[0].length).fill(undefined));

    tiles.forEach((cur, i) => {
      cur.forEach((tile, j) => {
        tilesInput[i][j] = {
          bottom: tile.bottom.id,
          collisions: tile.collisions,
          lighting: tile.lighting?.id,
          top: tile.top?.id,
        };
      });
    });

    const assetPlacements = assets.map((asset: types.TAsset) => ({
      asset: asset.id,
      position: [Math.round(asset.x), Math.round(asset.y), Math.round(asset.width), Math.round(asset.height)],
    }));
    const data: any = {
      name,
      tileSize,
      tiles: tilesInput,
      placements: assetPlacements,
      collisions: newCollisions,
    };

    await gql.updateMap(mapData.id, data);
    set({ isEdited: false });
  },
  pointerMoveOnTile: (e) => {
    get().isAssetAddMode() && get().previewAsset(e.point.x, e.point.y);
    get().isCollisionAddMode() && get().previewCollisionMove(e.point.x, e.point.y);
  },
  pointerDownOnTile: (e) => {
    get().isAssetAddMode() && get().addAsset(e.point.x, e.point.y);
    get().isCollisionAddMode() && get().previewCollision(e.point.x, e.point.y);
  },
  clickOnAsset: (e, index) => {
    get().isAssetRemoveMode() && get().removeAsset(index);
  },
  clickOnCollision: (e, index) => {
    get().isCollisionRemoveMode() && get().removeCollision(index);
  },
  toggleMapEditorOpen: () => {
    set((state) => ({ isMapEditorOpen: !state.isMapEditorOpen }));
  },
}));
