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
  image: string;
  id: string;
};
export type TCollision = {
  x: number;
  y: number;
  width: number;
  height: number;
};
