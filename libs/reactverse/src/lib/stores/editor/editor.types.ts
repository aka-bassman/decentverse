import gql from "graphql-tag";

export type Point = {
  x: number;
  y: number;
  z: number;
};

export type TMainTool = "Assets" | "Interaction" | "Dialog";
export type TEditMode = "Select" | "Add" | "Modify";

export type TPreview = {
  x: number;
  y: number;
  width: number;
  height: number;
  isPreview: boolean;
  image: string;
};
export type TInteractionPreview = {
  startX: number;
  startY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isPreview: boolean;
};
export type TMapItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  placeId: string;
};
export type TAsset = TMapItem & {
  top: string;
  bottom: string;
  lighting: string;
  id: string;
};
export type TCollision = TMapItem;
export type TCallRoom = TMapItem & {
  maxNum: number;
};
export type TWebview = TMapItem & {
  url: string;
  purpose: TWebviewPurpose;
  message: string;
  isEmbed: boolean;
};
export type TCharacter = { name: string; image?: string; avatarPosition?: TAvatarPosition };
export type TFlow = {
  avatarPositions: TAvatarPosition;
  text: string;
  characterIndex: number;
};
export type TUrls = {
  url: string;
  color: string;
};
export type TNewTiles = {
  down?: {
    id: string;
    preview: string;
  };
};
export type File = {
  id: string;
  filename: string;
  url: string;
  status: "active" | "inactive";
};
export type TViewItem = {
  type: "asset" | "collision" | "webview" | "callRoom";
  data: TAsset | TCollision | TWebview | TCallRoom;
};

export type TInteractionTool = "collision" | "webview" | "callRoom" | "talk";
export type TWebviewPurpose = "default" | "youtube" | "image" | "twitter";
export type TAvatarPosition = "left" | "right" | "center";

export const initPreview = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  isPreview: false,
};

export const fileFragment = gql`
  fragment fileFragment on File {
    id
    filename
    url
    status
  }
`;
