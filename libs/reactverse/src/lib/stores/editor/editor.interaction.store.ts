import * as types from "../types";
import * as gql from "../gql";
import { setLink } from "../apollo";
import * as scalar from "../scalar.type";
import { EditorSlice } from "./editor.store";

export interface EditorInteractionState {
  urlInput: string;
  inputCallRoomMaxNum: number;
  webviewPurpose: types.TWebviewPurpose;
  webviewMessage: string;
  webviewIsEmbed: boolean;
  interactionTool: types.TInteractionTool;
  collisionPreview: types.TInteractionPreview;
  callRoomPreview: types.TInteractionPreview;
  webviewPreview: types.TInteractionPreview;
  collisions: types.TCollision[];
  callRooms: types.TCallRoom[];
  webviews: types.TWebview[];
  isEditCallRoom: boolean;
  isEditWebview: boolean;
  isUrlInputError: boolean;
  selectedEditWebview?: types.TWebview;
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
  isValidUrl: (url: string, purpose: types.TWebviewPurpose) => boolean;
  toggleEditCallRoom: (placeId: string) => void;
  toggleEditWebview: (placeId: string) => void;
  modifyCallRoom: (placeId: string) => void;
  modifyWebview: (placeId: string) => void;
  setWebviewMessage: (message: string) => void;
  setWebviewIsEmbed: (isEmbed: boolean) => void;
}

export const editorInteractionSlice: EditorSlice<EditorInteractionState> = (set, get) => ({
  urlInput: "https://",
  inputCallRoomMaxNum: 100,
  webviewPurpose: "default",
  webviewMessage: "",
  webviewIsEmbed: true,
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
  isUrlInputError: true,
  isEditCallRoom: false,
  isEditWebview: false,
  selectedEditWebview: undefined,
  setUrlInput: (url) => {
    set({ urlInput: url, isUrlInputError: !get().isValidUrl(url, get().webviewPurpose) });
  },
  setInputCallRoomMaxNum: (maxNum) => {
    set({ inputCallRoomMaxNum: Number(maxNum) });
  },
  setWebviewPurpose: (purpose) => {
    const urlInput = get().checkIsInputUrl(purpose) ? "https://" : "";
    set({ webviewPurpose: purpose, urlInput, isUrlInputError: true });
  },
  checkIsInputUrl: (purpose) => {
    return ["default", "image"].includes(purpose);
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
      message: get().webviewMessage,
      isEmbed: get().webviewIsEmbed,
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
      get().editMode === "Add" &&
      !get().isUrlInputError
    );
  },
  isValidUrl: (url, purpose) => {
    if (!["default", "image"].includes(purpose)) return true;

    return true;

    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );

    return !!urlPattern.test(url);
  },
  toggleEditCallRoom: (placeId) => {
    if (!get().isEditCallRoom) {
      const currentCallRoom = get().callRooms.find((callRoom) => callRoom.placeId === placeId);
      set({
        isEditCallRoom: true,
        inputCallRoomMaxNum: currentCallRoom?.maxNum,
      });
    } else {
      set({ isEditCallRoom: false, inputCallRoomMaxNum: 100 });
    }
  },
  toggleEditWebview: (placeId) => {
    if (!get().isEditWebview) {
      const currentWebview = get().webviews.find((webview) => webview.placeId === placeId);
      if (!currentWebview) return;
      set({
        isEditWebview: true,
        selectedEditWebview: currentWebview,
        urlInput: currentWebview?.url,
        webviewPurpose: currentWebview?.purpose,
        webviewMessage: currentWebview.message,
        webviewIsEmbed: currentWebview.isEmbed,
      });
    } else {
      set({ isEditWebview: false, selectedEditWebview: undefined, urlInput: "https://", webviewPurpose: "default" });
    }
  },
  modifyCallRoom: (placeId: string) => {
    if (!get().inputCallRoomMaxNum) return;
    const newCallRooms = get().callRooms.map((callRoom) => {
      if (callRoom.placeId === placeId) return { ...callRoom, maxNum: get().inputCallRoomMaxNum };
      return callRoom;
    });
    const newViewItems = get().viewItems.map((viewItem) => {
      if (viewItem.type === "callRoom" && viewItem.data.placeId === placeId)
        return { ...viewItem, data: { ...viewItem.data, maxNum: get().inputCallRoomMaxNum } };
      return viewItem;
    });
    set({
      isEditCallRoom: false,
      callRooms: newCallRooms,
      inputCallRoomMaxNum: undefined,
      viewItems: newViewItems,
      isEdited: true,
    });
  },
  modifyWebview: (placeId: string) => {
    if (!get().urlInput || get().isUrlInputError) return;

    const currentInputs = {
      purpose: get().webviewPurpose,
      url: get().urlInput,
      message: get().webviewMessage,
      isEmbed: get().webviewIsEmbed,
    };

    const newWebviews = get().webviews.map((webview) => {
      if (webview.placeId === placeId) return { ...webview, ...currentInputs };
      return webview;
    });
    const newViewItems = get().viewItems.map((viewItem) => {
      if (viewItem.type === "webview" && viewItem.data.placeId === placeId)
        return { ...viewItem, data: { ...viewItem.data, ...currentInputs } };
      return viewItem;
    });
    set({
      isEditWebview: false,
      webviews: newWebviews,
      urlInput: "https://",
      webviewPurpose: "default",
      viewItems: newViewItems,
      isEdited: true,
    });
  },
  setWebviewMessage: (message) => {
    set({ webviewMessage: message });
  },
  setWebviewIsEmbed: (isEmbed) => {
    set({ webviewIsEmbed: isEmbed });
  },
});
