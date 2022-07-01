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
  editMode: types.TEditMode;
  mainTool: types.TMainTool;
  mapData?: types.Map;
  assetsData?: types.Asset[];
  viewMode: string[];
  selectedAssetId?: string;
  viewItems: types.TViewItem[];
  isEdited: boolean;
  preview: types.TPreview;
  assets: types.TAsset[];
  status: "none" | "loading" | "failed" | "idle";
  init: (mapId: string) => Promise<void>;
  getPlaceId: (prefix: "asset" | "collision" | "webview" | "callRoom", x: number, y: number) => string;
  previewAsset: (x: number, y: number) => void;
  addAsset: (x: number, y: number) => void;
  removeAsset: (placeId: string) => void;
  setEditMode: (item: types.TEditMode) => void;
  setMainTool: (item: types.TMainTool) => void;
  setInteractionTool: (item: types.TInteractionTool) => void;
  toggleViewMode: (item: string) => void;
  isActiveViewMode: (item: string) => boolean;
  setSelectedAssetId: (id: string) => void;
  replaceImgUrl: (url: string) => string;
  clearPreview: () => void;
  isAssetAddMode: () => boolean;
  saveMap: () => void;
  getWebviewUrl: (url: string, purpose: types.TWebviewPurpose) => string;
  pointerMoveOnTile: (e: any) => void;
  pointerDownOnTile: (e: any) => void;
  clickOnItem: (placeId: string) => void;
  toggleMapEditorOpen: () => void;
}

export const editorBaseSlice: EditorSlice<EditorBaseState> = (set, get) => ({
  isMapEditorOpen: false,
  // isMapEditorOpen: true, //! todo
  assetPlacements: [],
  tileSize: 2000,
  mapWidth: 2000,
  mapHeight: 2000,
  editMode: "Select",
  mainTool: "Assets" as types.TMainTool,
  mapData: undefined,
  assetsData: [], //
  assets: [],
  viewMode: ["Interaction", "Assets"],
  viewItems: [],
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
      placeId: get().getPlaceId("asset", placement.position[0], placement.position[1]),
    }));

    const collisions = mapData.collisions.map((interaction) => {
      const x = (interaction.topLeft[0] + interaction.bottomRight[0]) / 2;
      const y = (interaction.topLeft[1] + interaction.bottomRight[1]) / 2;

      return {
        x,
        y,
        width: Math.abs(interaction.bottomRight[0] - interaction.topLeft[0]),
        height: Math.abs(interaction.bottomRight[1] - interaction.topLeft[1]),
        placeId: get().getPlaceId("collision", x, y),
      };
    });

    const webviews = mapData.webviews.map((interaction) => {
      const x = (interaction.topLeft[0] + interaction.bottomRight[0]) / 2;
      const y = (interaction.topLeft[1] + interaction.bottomRight[1]) / 2;
      let url = interaction.url;
      if (interaction.purpose === "youtube") {
        url = interaction.url.split("/embed/")[1];
      }

      return {
        x,
        y,
        width: Math.abs(interaction.bottomRight[0] - interaction.topLeft[0]),
        height: Math.abs(interaction.bottomRight[1] - interaction.topLeft[1]),
        url,
        purpose: interaction.purpose,
        message: interaction.message || "",
        isEmbed: interaction.isEmbed,
        placeId: get().getPlaceId("webview", x, y),
      };
    });

    const callRooms = mapData.callRooms.map((interaction) => {
      const x = (interaction.topLeft[0] + interaction.bottomRight[0]) / 2;
      const y = (interaction.topLeft[1] + interaction.bottomRight[1]) / 2;

      return {
        x,
        y,
        width: Math.abs(interaction.bottomRight[0] - interaction.topLeft[0]),
        height: Math.abs(interaction.bottomRight[1] - interaction.topLeft[1]),
        maxNum: interaction.maxNum,
        placeId: get().getPlaceId("callRoom", x, y),
        roomId: interaction.roomId,
      };
    });
    set((state) => ({
      mapData,
      assetsData,
      assets,
      collisions,
      webviews,
      callRooms,
      isLoadModalOpen: false,
    }));
  },
  getPlaceId: (prefix, x, y) => {
    return `${prefix}_${Math.round(x)}_${Math.round(y)}`;
  },
  setEditMode: (item) => {
    get().clearPreview();
    get().clearInteractionPreview();
    set({ editMode: item, selectedAssetId: undefined });
  },
  setMainTool: (item) => {
    get().clearPreview();
    get().clearInteractionPreview();
    set({ mainTool: item, selectedAssetId: undefined });
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
      placeId: get().getPlaceId("asset", x, y),
    };
    set((state) => ({ assets: [...state.assets, newAsset], isEdited: true }));
  },
  replaceImgUrl: (url) => {
    return url.replace("https://asset.ayias.io/", "ayias/");
  },
  removeAsset: (placeId) => {
    set((state) => ({
      assets: state.assets.filter((asset) => asset.placeId !== placeId),
      selectedAssetId: undefined,
      viewItems: state.viewItems.filter((cur) => cur.data.placeId !== placeId),
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
    return !!(get().mainTool === "Assets" && get().editMode === "Add" && get().selectedAssetId);
  },
  saveMap: async () => {
    const { isEdited, mapData, assets } = get();
    if (!isEdited || !mapData) return;
    const { name, tileSize, tiles } = mapData;

    const newCollisions: scalar.CollisionInput[] = get().collisions.map((collision) => ({
      topLeft: [Math.round(collision.x - collision.width / 2), Math.round(collision.y + collision.height / 2)],
      bottomRight: [Math.round(collision.x + collision.width / 2), Math.round(collision.y - collision.height / 2)],
    }));

    const newWebviews: scalar.WebviewInput[] = get().webviews.map((webview) => ({
      topLeft: [Math.round(webview.x - webview.width / 2), Math.round(webview.y + webview.height / 2)],
      bottomRight: [Math.round(webview.x + webview.width / 2), Math.round(webview.y - webview.height / 2)],
      url: get().getWebviewUrl(webview.url, webview.purpose),
      size: [100, 100], //!
      message: webview.message,
      isEmbed: webview.isEmbed,
      purpose: webview.purpose,
    }));

    const newCallRooms: scalar.CallRoomInput[] = get().callRooms.map((callRoom) => ({
      topLeft: [Math.round(callRoom.x - callRoom.width / 2), Math.round(callRoom.y + callRoom.height / 2)],
      bottomRight: [Math.round(callRoom.x + callRoom.width / 2), Math.round(callRoom.y - callRoom.height / 2)],
      maxNum: callRoom.maxNum,
      roomId: callRoom.placeId,
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
          dialogues: [],
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
  getWebviewUrl: (url, purpose) => {
    if (purpose === "youtube") return `https://youtube.com/embed/${url}`;
    return url;
  },
  pointerMoveOnTile: (e) => {
    get().isAssetAddMode() && get().previewAsset(e.point.x, e.point.y);
    get().isCollisionAddMode() && get().previewCollisionMove(e.point.x, e.point.y);
    get().isCallRoomAddMode() && get().previewCallRoomMove(e.point.x, e.point.y);
    get().isWebviewAddMode() && get().previewWebviewMove(e.point.x, e.point.y);
  },
  pointerDownOnTile: (e) => {
    set({ viewItems: [] });
    get().isAssetAddMode() && get().addAsset(e.point.x, e.point.y);
    get().isCollisionAddMode() && get().previewCollision(e.point.x, e.point.y);
    get().isCallRoomAddMode() && get().previewCallRoom(e.point.x, e.point.y);
    get().isWebviewAddMode() && get().previewWebview(e.point.x, e.point.y);
  },
  clickOnItem: (placeId) => {
    if (get().editMode !== "Select" || get().viewItems.find((cur) => cur.data.placeId === placeId)) return;

    if (placeId.includes("asset")) {
      const data = get().assets.find((cur) => cur.placeId === placeId);
      data && set((state) => ({ viewItems: [...state.viewItems, { type: "asset", data }] }));
    }
    if (placeId.includes("collision")) {
      const data = get().collisions.find((cur) => cur.placeId === placeId);
      data && set((state) => ({ viewItems: [...state.viewItems, { type: "collision", data }] }));
    }
    if (placeId.includes("webview")) {
      const data = get().webviews.find((cur) => cur.placeId === placeId);
      data && set((state) => ({ viewItems: [...state.viewItems, { type: "webview", data }] }));
    }
    if (placeId.includes("callRoom")) {
      const data = get().callRooms.find((cur) => cur.placeId === placeId);
      data && set((state) => ({ viewItems: [...state.viewItems, { type: "callRoom", data }] }));
    }
  },
  toggleMapEditorOpen: () => {
    set((state) => ({ isMapEditorOpen: !state.isMapEditorOpen }));
  },
});
