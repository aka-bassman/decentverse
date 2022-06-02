import React, { Suspense, useRef, MutableRefObject, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader } from "three";
import { useTexture } from "@react-three/drei";

export interface TileProp {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

export const Tile = React.memo(({ x, y, offsetX, offsetY }: TileProp) => {
  const renderTiles = useWorld((state) => state.render.tiles);
  //   const loader = new TextureLoader();
  //   loader.crossOrigin = "";

  const [map] = useTexture([renderTiles[x][y].bottom.url.replace("https://", "/path/")]);
  // ImageUtils.crossOrigin
  const position = new Vector3(offsetX, offsetY, -0.0000001);
  return (
    <Suspense fallback={null}>
      <sprite position={position}>
        <planeGeometry args={[2000, 2000]} />
        <spriteMaterial map={map} />
      </sprite>
    </Suspense>
  );
});
