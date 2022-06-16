import create from "zustand";
import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
export interface MapEditorState {
  isMapEditorOpen: boolean;
  assetPlacements: types.Placement[];
  tileSize: number;
  mapWidth: number; //
  mapHeight: number; //
  mainTool: types.TMainTool;
  subTool: string;
  interactionTool: types.TInteractionTool;
  mapData?: types.Map;
  assetsData?: types.Asset[];
  viewMode: string[];
  selectedAssetId?: string;
  isEdited: boolean;
  preview: types.TPreview;
  collisionPreview: types.TInteractionPreview;
  callRoomPreview: types.TInteractionPreview;
  webviewPreview: types.TInteractionPreview;
  assets: types.TAsset[];
  collisions: types.TCollision[];
  callRooms: types.TCallRoom[];
  webviews: types.TWebview[];
  status: "none" | "loading" | "failed" | "idle";
  mapTool: {
    mapList: types.Map[];
    isNewModalOpen: boolean;
    isLoadModalOpen: boolean;
    inputName: string;
    loadMapList: () => Promise<void>;
    toggleNewModalOpen: () => void;
    toggleLoadModalOpen: () => void;
    closeMap: () => void;
    updateName: (value: string) => void;
    validationCheck: () => boolean;
    createMap: () => Promise<void>;
  };
  tileTool: {
    isTilesModalOpen: boolean;
    newTiles: types.scalar.TileInput[][];
    toggleTilesModalOpen: () => void;
    addMapFile: (file: any, type: "bottom" | "top" | "lighting") => Promise<void>;
    validationCheck: () => boolean;
    addTiles: () => Promise<void>;
  };
  webviewTool: {
    urlInput: string;
    urls: types.TUrls[];
    selectedUrl: string;
    setUrlInput: (url: string) => void;
    addUrl: () => void;
    selectUrl: (url: string) => void;
  };
  init: (mapId: string) => Promise<void>;
  previewAsset: (x: number, y: number) => void;
  addAsset: (x: number, y: number) => void;
  addCollision: () => void;
  addCallRoom: () => void;
  addWebview: () => void;
  previewCollision: (x: number, y: number) => void;
  previewCollisionMove: (x: number, y: number) => void;
  previewCallRoom: (x: number, y: number) => void;
  previewCallRoomMove: (x: number, y: number) => void;
  previewWebview: (x: number, y: number) => void;
  previewWebviewMove: (x: number, y: number) => void;
  // removeAsset: (x: number, y: number) => void;
  removeAsset: (index: number) => void;
  removeCollision: (index: number) => void;
  removeCallRoom: (index: number) => void;
  removeWebview: (index: number) => void;
  setMainTool: (item: types.TMainTool) => void;
  setSubTool: (item: string) => void;
  setInteractionTool: (item: types.TInteractionTool) => void;
  toggleViewMode: (item: string) => void;
  isActiveViewMode: (item: string) => boolean;
  setSelectedAssetId: (id: string) => void;
  replaceImgUrl: (url: string) => string;
  clearPreview: () => void;
  clearInteractionPreview: () => void;
  isAssetAddMode: () => boolean;
  isAssetRemoveMode: () => boolean;
  isCollisionAddMode: () => boolean;
  isCallRoomAddMode: () => boolean;
  isWebviewAddMode: () => boolean;
  isInteractionRemoveMode: () => boolean;
  saveMap: () => void;
  pointerMoveOnTile: (e: any) => void;
  pointerDownOnTile: (e: any) => void;
  clickOnAsset: (e: any, index: number) => void;
  clickOnCollision: (e: any, index: number) => void;
  clickOnCallRoom: (e: any, index: number) => void;
  clickOnWebview: (e: any, index: number) => void;
  toggleMapEditorOpen: () => void;
}
export const useMapEditor = create<MapEditorState>((set, get) => ({
  isMapEditorOpen: false,
  // isMapEditorOpen: true,
  assetPlacements: [],
  tileSize: 2000,
  mapWidth: 2000,
  mapHeight: 2000,
  mainTool: "Assets",
  subTool: "Add",
  interactionTool: "collision",
  mapData: undefined,
  assetsData: [], //
  assets: [],
  collisions: [],
  callRooms: [],
  webviews: [],
  viewMode: ["Interaction", "Assets"],
  selectedAssetId: undefined,
  isEdited: false,
  preview: {
    ...types.initPreview,
    image: "",
  },
  collisionPreview: {
    ...types.initPreview,
    startX: 0,
    startY: 0,
  },
  callRoomPreview: {
    ...types.initPreview,
    startX: 0,
    startY: 0,
  },
  webviewPreview: {
    ...types.initPreview,
    startX: 0,
    startY: 0,
  },
  status: "none",
  mapTool: {
    mapList: [],
    isNewModalOpen: false,
    isLoadModalOpen: false,
    inputName: "",
    loadMapList: async () => {
      const mapList = await gql.maps();
      set((state) => ({ mapTool: { ...state.mapTool, mapList } }));
    },
    toggleNewModalOpen: () => {
      set((state) => ({ mapTool: { ...state.mapTool, isNewModalOpen: !state.mapTool.isNewModalOpen } }));
    },
    toggleLoadModalOpen: () => {
      set((state) => ({ mapTool: { ...state.mapTool, isLoadModalOpen: !state.mapTool.isLoadModalOpen } }));
    },
    closeMap: () => {
      set({ mapData: undefined, assetsData: [] });
      // set((state) => ({ mapTool: { ...state.mapTool, isLoadModalOpen: !state.mapTool.isLoadModalOpen } }));
    },
    updateName: (value: string) => {
      set((state) => ({ mapTool: { ...state.mapTool, inputName: value } }));
    },
    validationCheck: () => {
      const { inputName } = get().mapTool;
      return !!inputName;
    },
    createMap: async () => {
      if (!get().mapTool.validationCheck()) return;
      const { inputName } = get().mapTool;

      const data = {
        name: inputName,
        tileSize: 2000,
        collisions: [],
        placements: [],
        tiles: [],
        webviews: [],
        callRooms: [],
      };

      set((state) => ({ mapTool: { ...state.mapTool, isNewModalOpen: false } }));
      const newMap = await gql.createMap(data);
      newMap?.id && (await get().init(newMap.id));
    },
  },
  tileTool: {
    isTilesModalOpen: false,
    newTiles: [],
    toggleTilesModalOpen: () => {
      set((state) => ({ tileTool: { ...state.tileTool, isTilesModalOpen: !state.tileTool.isTilesModalOpen } }));
    },
    addMapFile: async (file, type) => {
      const mapData = get().mapData;
      if (!mapData) return;
      const imageFiles = await gql.addMapFile(file, mapData.name);
      const newItem = { bottom: undefined, top: undefined, lighting: undefined, collisions: [], webviews: [] };

      let newTiles: types.scalar.TileInput[][] = JSON.parse(JSON.stringify(get().tileTool.newTiles));

      imageFiles?.forEach((cur) => {
        const indexText = cur.url.split(mapData.name)[1].split("/")[1].split("-");
        const [heightIndex, widthIndex] = [Number(indexText[0]), Number(indexText[1])];
        if (!newTiles[widthIndex]) newTiles[widthIndex] = [];
        if (!newTiles[widthIndex][heightIndex]) newTiles[widthIndex][heightIndex] = newItem;
        newTiles = JSON.parse(JSON.stringify(newTiles));
        newTiles[widthIndex][heightIndex][type] = cur.id;
      });

      set((state) => ({
        tileTool: { ...state.tileTool, newTiles },
      }));
    },
    validationCheck: () => {
      const { newTiles } = get().tileTool;
      return !!newTiles?.[0]?.[0]?.bottom;
    },
    addTiles: async () => {
      const { newTiles } = get().tileTool;
      const { mapData } = get();
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

      // const data = { ...mapData, tiles: newTiles };

      await gql.updateMap(mapData.id, data);
      set((state) => ({ tileTool: { ...state.tileTool, newTiles: [], isTilesModalOpen: false } }));
      mapData?.id && (await get().init(mapData.id));
    },
  },
  webviewTool: {
    urlInput: "https://",
    urls: [],
    selectedUrl: "",
    setUrlInput: (url) => {
      set((state) => ({ webviewTool: { ...state.webviewTool, urlInput: url } }));
    },
    addUrl: () => {
      const newUrl = { color: "#ddd", url: get().webviewTool.urlInput };
      set((state) => ({
        webviewTool: { ...state.webviewTool, urlInput: "https://", urls: [...state.webviewTool.urls, newUrl] },
      }));
    },
    selectUrl: (url) => {
      set((state) => ({ webviewTool: { ...state.webviewTool, selectedUrl: url } }));
    },
  },
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
      mapTool: { ...state.mapTool, isLoadModalOpen: false },
      webviewTool: { ...state.webviewTool, urls },
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
  addCallRoom: () => {
    const { x, y, width, height } = get().callRoomPreview;
    const newCallRooms = { x, y, width, height };

    set((state) => ({
      callRooms: [...state.callRooms, newCallRooms],
      callRoomPreview: {
        ...state.callRoomPreview,
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
  previewCallRoom: (x, y) => {
    if (!get().callRoomPreview.isPreview) {
      set((state) => ({
        callRoomPreview: { ...state.callRoomPreview, isPreview: true, startX: x, startY: y },
      }));
    } else {
      get().addCallRoom();
    }
  },
  previewCallRoomMove: (x, y) => {
    if (!get().callRoomPreview.isPreview) return;

    const prevX = get().callRoomPreview.startX;
    set((state) => ({
      callRoomPreview: {
        ...state.callRoomPreview,
        isPreview: true,
        x: (x + state.callRoomPreview.startX) / 2,
        y: (y + state.callRoomPreview.startY) / 2,
        width: Math.abs(x - state.callRoomPreview.startX),
        height: Math.abs(y - state.callRoomPreview.startY),
      },
    }));
  },
  addWebview: () => {
    const { x, y, width, height } = get().webviewPreview;
    const { selectedUrl } = get().webviewTool;
    const newWebview = { x, y, width, height, url: selectedUrl };

    set((state) => ({
      webviews: [...state.webviews, newWebview],
      webviewPreview: {
        ...state.webviewPreview,
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
  previewWebview: (x, y) => {
    if (!get().webviewPreview.isPreview) {
      set((state) => ({
        webviewPreview: { ...state.webviewPreview, isPreview: true, startX: x, startY: y },
      }));
    } else {
      get().addWebview();
    }
  },
  previewWebviewMove: (x, y) => {
    if (!get().webviewPreview.isPreview) return;

    const prevX = get().webviewPreview.startX;
    set((state) => ({
      webviewPreview: {
        ...state.webviewPreview,
        isPreview: true,
        x: (x + state.webviewPreview.startX) / 2,
        y: (y + state.webviewPreview.startY) / 2,
        width: Math.abs(x - state.webviewPreview.startX),
        height: Math.abs(y - state.webviewPreview.startY),
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
  removeCallRoom: (index) => {
    set((state) => ({
      callRooms: [...state.callRooms.slice(0, index), ...state.callRooms.slice(index + 1)],
      isEdited: true,
    }));
  },
  removeWebview: (index) => {
    console.log("removeWebview", index);
    set((state) => ({
      webviews: [...state.webviews.slice(0, index), ...state.webviews.slice(index + 1)],
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
  clearInteractionPreview: () => {
    const resetData = {
      isPreview: false,
      startX: 0,
      startY: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    set((state) => ({
      collisionPreview: {
        ...state.collisionPreview,
        ...resetData,
      },
      callRoomPreview: {
        ...state.callRoomPreview,
        ...resetData,
      },
      webviewPreview: {
        ...state.webviewPreview,
        ...resetData,
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
    return !!(get().mainTool === "Interaction" && get().interactionTool === "collision" && get().subTool === "Add");
  },
  isCallRoomAddMode: () => {
    return !!(get().mainTool === "Interaction" && get().interactionTool === "callRoom" && get().subTool === "Add");
  },
  isWebviewAddMode: () => {
    return !!(
      get().mainTool === "Interaction" &&
      get().interactionTool === "webview" &&
      get().webviewTool.selectedUrl &&
      get().subTool === "Add"
    );
  },
  isInteractionRemoveMode: () => {
    return !!(get().mainTool === "Interaction" && get().subTool === "Remove");
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
  clickOnCollision: (e, index) => {
    get().isInteractionRemoveMode() && get().removeCollision(index);
  },
  clickOnCallRoom: (e, index) => {
    get().isInteractionRemoveMode() && get().removeCallRoom(index);
  },
  clickOnWebview: (e: any, index: number) => {
    get().isInteractionRemoveMode() && get().removeWebview(index);
  },
  toggleMapEditorOpen: () => {
    set((state) => ({ isMapEditorOpen: !state.isMapEditorOpen }));
  },
}));
