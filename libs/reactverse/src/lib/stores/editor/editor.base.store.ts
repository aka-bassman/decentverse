// import create from "zustand";
import { GetState, SetState } from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorState, EditorSlice } from "./editor.store";

export interface EditorBaseState {
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
  assets: types.TAsset[];
  status: "none" | "loading" | "failed" | "idle";
  init: (mapId: string) => Promise<void>;
  previewAsset: (x: number, y: number) => void;
  addAsset: (x: number, y: number) => void;
  removeAsset: (index: number) => void;
  setMainTool: (item: types.TMainTool) => void;
  setSubTool: (item: string) => void;
  setInteractionTool: (item: types.TInteractionTool) => void;
  toggleViewMode: (item: string) => void;
  isActiveViewMode: (item: string) => boolean;
  setSelectedAssetId: (id: string) => void;
  replaceImgUrl: (url: string) => string;
  clearPreview: () => void;
  isAssetAddMode: () => boolean;
  isAssetRemoveMode: () => boolean;
  saveMap: () => void;
  pointerMoveOnTile: (e: any) => void;
  pointerDownOnTile: (e: any) => void;
  clickOnAsset: (e: any, index: number) => void;
  toggleMapEditorOpen: () => void;
}

export const editorBaseSlice: EditorSlice<EditorBaseState> = (set, get) => ({
  isMapEditorOpen: false,
  assetPlacements: [],
  tileSize: 2000,
  mapWidth: 2000,
  mapHeight: 2000,
  mainTool: "Assets" as types.TMainTool,
  subTool: "Add",
  mapData: undefined,
  assetsData: [], //
  assets: [],
  viewMode: ["Interaction", "Assets"],
  selectedAssetId: undefined,
  isEdited: false,
  preview: {
    ...types.initPreview,
    image: "",
  },
  status: "none",
  init: async (mapId) => {
    setLink();
    const mapData = await gql.map(mapId);
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

    const urls: types.TUrls[] = [];
    const webviews = mapData.webviews.map((interaction) => {
      if (interaction.url && !urls.find((cur) => cur.url === interaction.url)) {
        urls.push({ url: interaction.url, color: "#ccc" });
      }
      return {
        x: (interaction.topLeft[0] + interaction.bottomRight[0]) / 2,
        y: (interaction.topLeft[1] + interaction.bottomRight[1]) / 2,
        width: Math.abs(interaction.bottomRight[0] - interaction.topLeft[0]),
        height: Math.abs(interaction.bottomRight[1] - interaction.topLeft[1]),
        url: interaction.url ?? "",
      };
    });

    const callRooms = mapData.callRooms.map((callRoom) => ({
      x: (callRoom.topLeft[0] + callRoom.bottomRight[0]) / 2,
      y: (callRoom.topLeft[1] + callRoom.bottomRight[1]) / 2,
      width: Math.abs(callRoom.bottomRight[0] - callRoom.topLeft[0]),
      height: Math.abs(callRoom.bottomRight[1] - callRoom.topLeft[1]),
    }));

    set((state) => ({
      mapData,
      assetsData,
      assets,
      collisions,
      webviews,
      callRooms,
      isLoadModalOpen: false,
      urls,
      // mapTool: { ...state.mapTool, isLoadModalOpen: false },
      // webviewTool: { ...state.webviewTool, urls },
    }));
  },
  setMainTool: (item) => {
    get().clearPreview();
    get().clearInteractionPreview();
    set({ mainTool: item, subTool: "Add", selectedAssetId: undefined });
  },
  setSubTool: (item) => {
    get().clearPreview();
    get().clearInteractionPreview();
    set({ subTool: item, selectedAssetId: undefined });
  },
  setInteractionTool: (item) => {
    get().clearPreview();
    get().clearInteractionPreview();
    set({ interactionTool: item, selectedAssetId: undefined });
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
  replaceImgUrl: (url) => {
    return url.replace("https://asset.ayias.io/", "ayias/");
  },
  removeAsset: (index) => {
    set((state) => ({
      assets: [...state.assets.slice(0, index), ...state.assets.slice(index + 1)],
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
    get().clearInteractionPreview();
    set({ selectedAssetId: id });
  },
  clearPreview: () => {
    set({
      preview: { x: 0, y: 0, width: 0, height: 0, isPreview: false, image: "" },
    });
  },
  isAssetAddMode: () => {
    return !!(get().mainTool === "Assets" && get().subTool === "Add" && get().selectedAssetId);
  },
  isAssetRemoveMode: () => {
    return !!(get().mainTool === "Assets" && get().subTool === "Remove");
  },
  saveMap: async () => {
    const { isEdited, mapData, assets } = get();
    if (!isEdited || !mapData) return;
    const { name, tileSize, tiles } = mapData;

    const newCollisions = get().collisions.map((collision) => ({
      type: "collision",
      topLeft: [Math.round(collision.x - collision.width / 2), Math.round(collision.y + collision.height / 2)],
      bottomRight: [Math.round(collision.x + collision.width / 2), Math.round(collision.y - collision.height / 2)],
    }));

    const newWebviews = get().webviews.map((webview) => ({
      type: "webview",
      topLeft: [Math.round(webview.x - webview.width / 2), Math.round(webview.y + webview.height / 2)],
      bottomRight: [Math.round(webview.x + webview.width / 2), Math.round(webview.y - webview.height / 2)],
      url: webview.url,
    }));

    const newCallRooms = get().callRooms.map((callRoom) => ({
      type: "callRoom",
      topLeft: [Math.round(callRoom.x - callRoom.width / 2), Math.round(callRoom.y + callRoom.height / 2)],
      bottomRight: [Math.round(callRoom.x + callRoom.width / 2), Math.round(callRoom.y - callRoom.height / 2)],
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
          webviews: tile.webviews,
          callRooms: tile.callRooms,
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
      webviews: newWebviews,
      callRooms: newCallRooms,
    };

    await gql.updateMap(mapData.id, data);
    set({ isEdited: false });
  },
  pointerMoveOnTile: (e) => {
    get().isAssetAddMode() && get().previewAsset(e.point.x, e.point.y);
    get().isCollisionAddMode() && get().previewCollisionMove(e.point.x, e.point.y);
    get().isCallRoomAddMode() && get().previewCallRoomMove(e.point.x, e.point.y);
    get().isWebviewAddMode() && get().previewWebviewMove(e.point.x, e.point.y);
  },
  pointerDownOnTile: (e) => {
    get().isAssetAddMode() && get().addAsset(e.point.x, e.point.y);
    get().isCollisionAddMode() && get().previewCollision(e.point.x, e.point.y);
    get().isCallRoomAddMode() && get().previewCallRoom(e.point.x, e.point.y);
    get().isWebviewAddMode() && get().previewWebview(e.point.x, e.point.y);
  },
  clickOnAsset: (e, index) => {
    get().isAssetRemoveMode() && get().removeAsset(index);
  },
  toggleMapEditorOpen: () => {
    set((state) => ({ isMapEditorOpen: !state.isMapEditorOpen }));
  },
});
