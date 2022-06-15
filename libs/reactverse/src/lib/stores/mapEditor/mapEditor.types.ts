import gql from "graphql-tag";

export type Point = {
  x: number;
  y: number;
  z: number;
};

export type TMainTool = "Map" | "Assets" | "Interaction";
export type TPreview = {
  x: number;
  y: number;
  width: number;
  height: number;
  isPreview: boolean;
  image: string;
};
export type TCollisionPreview = {
  startX: number;
  startY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isPreview: boolean;
};
export type TAsset = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: string;
  bottom: string;
  lighting: string;
  id: string;
};
export type TCollision = {
  x: number;
  y: number;
  width: number;
  height: number;
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

export const fileFragment = gql`
  fragment fileFragment on File {
    id
    filename
    url
    status
  }
`;
