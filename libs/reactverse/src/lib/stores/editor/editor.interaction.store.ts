import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorSlice } from "./editor.store";

export interface EditorInteractionState {
  urlInput: string;
  inputCallRoomMaxNum?: number;
  webviewPurpose: types.TWebviewPurpose;
  interactionTool: types.TInteractionTool;
  collisionPreview: types.TInteractionPreview;
  callRoomPreview: types.TInteractionPreview;
  webviewPreview: types.TInteractionPreview;
  collisions: types.TCollision[];
  callRooms: types.TCallRoom[];
  webviews: types.TWebview[];
  talks: types.TTalk[];
  isScriptModalOpen: boolean;
  characterNameInput: string;
  characters: types.TCharacter[];
  selectedCharacter?: types.TCharacter;
  setUrlInput: (url: string) => void;
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
  removeCollision: (placeId: string) => void;
  removeCallRoom: (placeId: string) => void;
  removeWebview: (placeId: string) => void;
  clearInteractionPreview: () => void;
  isCollisionAddMode: () => boolean;
  isCallRoomAddMode: () => boolean;
  isWebviewAddMode: () => boolean;
  toggleScriptModalOpen: () => void;
  addScript: () => Promise<void>;
  setCharacterNameInput: (name: string) => void;
  addCharacter: () => void;
  selectCharacter: (index: number) => void;
}

export const editorInteractionSlice: EditorSlice<EditorInteractionState> = (set, get) => ({
  urlInput: "https://",
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
  talks: [],
  isScriptModalOpen: false,
  characterNameInput: "",
  characters: [],
  selectedCharacter: undefined,
  setUrlInput: (url) => {
    set({ urlInput: url });
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
    const newCollision = { x, y, width, height, placeId: get().getPlaceId("collision", x, y) };

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
    const placeId = get().getPlaceId("callRoom", x, y);
    const newCallRooms = { x, y, width, height, maxNum, placeId, roomId: placeId };

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
    const newWebview = {
      x,
      y,
      width,
      height,
      url: get().urlInput,
      purpose: get().webviewPurpose,
      placeId: get().getPlaceId("webview", x, y),
    };

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
  removeCollision: (placeId) => {
    set((state) => ({
      collisions: state.collisions.filter((collision) => collision.placeId !== placeId),
      viewItems: state.viewItems.filter((cur) => cur.data.placeId !== placeId),
      isEdited: true,
    }));
  },
  removeCallRoom: (placeId) => {
    set((state) => ({
      callRooms: state.callRooms.filter((callRoom) => callRoom.placeId !== placeId),
      viewItems: state.viewItems.filter((cur) => cur.data.placeId !== placeId),
      isEdited: true,
    }));
  },
  removeWebview: (placeId) => {
    set((state) => ({
      webviews: state.webviews.filter((webview) => webview.placeId !== placeId),
      viewItems: state.viewItems.filter((cur) => cur.data.placeId !== placeId),
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
    return !!(get().mainTool === "Interaction" && get().interactionTool === "collision" && get().editMode === "Add");
  },
  isCallRoomAddMode: () => {
    return !!(get().mainTool === "Interaction" && get().interactionTool === "callRoom" && get().editMode === "Add");
  },
  isWebviewAddMode: () => {
    return !!(
      get().mainTool === "Interaction" &&
      get().interactionTool === "webview" &&
      get().urlInput &&
      get().editMode === "Add"
    );
  },
  toggleScriptModalOpen: () => {
    set((state) => ({ isScriptModalOpen: !state.isScriptModalOpen }));
  },
  addScript: async () => {
    console.log("addScript");
  },
  setCharacterNameInput: (name) => {
    set({ characterNameInput: name });
  },
  addCharacter: () => {
    if (!get().characterNameInput) return;
    const newCharacter = { name: get().characterNameInput, image: undefined };
    set((state) => ({
      characters: [...state.characters, newCharacter],
      characterNameInput: "",
    }));
  },
  selectCharacter: (index) => {
    set((state) => ({ selectedCharacter: state.characters[index] }));
  },
});
