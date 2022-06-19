import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorSlice } from "./editor.store";

export interface EditorInteractionState {
  urlInput: string;
  urls: types.TUrls[]; //!
  selectedUrl: string; //!
  inputCallRoomMaxNum?: number;
  webviewPurpose: types.TWebviewPurpose;
  interactionTool: types.TInteractionTool;
  collisionPreview: types.TInteractionPreview;
  callRoomPreview: types.TInteractionPreview;
  webviewPreview: types.TInteractionPreview;
  collisions: types.TCollision[];
  callRooms: types.TCallRoom[];
  webviews: types.TWebview[];
  setUrlInput: (url: string) => void;
  addUrl: () => void; //!
  selectUrl: (url: string) => void; //!
  setInputCallRoomMaxNum: (maxNum: number) => void;
  setWebviewPurpose: (purpose: types.TWebviewPurpose) => void;
  checkIsInputUrl: (purpose: types.TWebviewPurpose) => boolean;
  addCollision: () => void;
  addCallRoom: () => void;
  addWebview: () => void;
  previewCollision: (x: number, y: number) => void;
  previewCollisionMove: (x: number, y: number) => void;
  previewCallRoom: (x: number, y: number) => void;
  previewCallRoomMove: (x: number, y: number) => void;
  previewWebview: (x: number, y: number) => void;
  previewWebviewMove: (x: number, y: number) => void;
  removeCollision: (index: number) => void;
  removeCallRoom: (index: number) => void;
  removeWebview: (index: number) => void;
  clearInteractionPreview: () => void;
  isCollisionAddMode: () => boolean;
  isCallRoomAddMode: () => boolean;
  isWebviewAddMode: () => boolean;
  isInteractionRemoveMode: () => boolean;
  clickOnCollision: (e: any, index: number) => void;
  clickOnCallRoom: (e: any, index: number) => void;
  clickOnWebview: (e: any, index: number) => void;
}

// createFishSlice
export const editorInteractionSlice: EditorSlice<EditorInteractionState> = (set, get) => ({
  urlInput: "https://",
  urls: [],
  selectedUrl: "",
  inputCallRoomMaxNum: 100,
  webviewPurpose: "default",
  interactionTool: "collision",
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
  collisions: [],
  callRooms: [],
  webviews: [],
  setUrlInput: (url) => {
    set({ urlInput: url });
  },
  addUrl: () => {
    const newUrl = { color: "#ddd", url: get().urlInput };
    // set((state) => ({
    //   webviewTool: { ...state.webviewTool, urlInput: "https://", urls: [...state.webviewTool.urls, newUrl] },
    // }));
    set((state) => ({
      urlInput: "https://",
      urls: [...state.urls, newUrl],
    }));
  },
  selectUrl: (url) => {
    // set((state) => ({ webviewTool: { ...state.webviewTool, selectedUrl: url } }));
    set({ selectedUrl: url });
  },
  setInputCallRoomMaxNum: (maxNum) => {
    set({ inputCallRoomMaxNum: Number(maxNum) });
  },
  setWebviewPurpose: (purpose) => {
    const urlInput = get().checkIsInputUrl(purpose) ? "https://" : "";
    set({ webviewPurpose: purpose, urlInput });
  },
  checkIsInputUrl: (purpose) => {
    return ["default", "image", "twitter"].includes(purpose);
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
    const maxNum = get().inputCallRoomMaxNum;
    if (!maxNum) return;
    const { x, y, width, height } = get().callRoomPreview;
    const newCallRooms = { x, y, width, height, maxNum };

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
    const newWebview = { x, y, width, height, url: get().urlInput, purpose: get().webviewPurpose };

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
    set((state) => ({
      webviews: [...state.webviews.slice(0, index), ...state.webviews.slice(index + 1)],
      isEdited: true,
    }));
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
      get().urlInput &&
      get().subTool === "Add"
    );
  },
  isInteractionRemoveMode: () => {
    return !!(get().mainTool === "Interaction" && get().subTool === "Remove");
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
});
