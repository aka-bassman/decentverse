import { Suspense, MutableRefObject } from "react";
import styled from "styled-components";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { useMapEditor, scalar } from "../../stores";
import * as types from "../../stores/types";

import * as THREE from "three";

export const MapTiles = ({
  mapData,
  keyboard,
}: {
  mapData: types.Map;
  keyboard: MutableRefObject<scalar.Keyboard>;
}) => {
  const { camera } = useThree();

  const { tileSize, pointerMoveOnTile, pointerDownOnTile } = useMapEditor();

  useFrame(() => {
    const offest = 80;
    keyboard.current.right && camera.translateX(offest);
    keyboard.current.left && camera.translateX(-1 * offest);
    keyboard.current.up && camera.translateY(offest);
    keyboard.current.down && camera.translateY(-1 * offest);
  });

  const tileImages: string[] = [];
  const tilesPosition: { i: number; j: number; x: number; y: number }[] = [];
  mapData?.tiles.forEach((cur, i: number) => {
    cur.forEach((tile, j: number) => {
      tileImages.push(tile.bottom.url.replace("https://asset.ayias.io/", "ayias/"));
      tilesPosition.push({
        i: i,
        j: j,
        x: tileSize * j + tileSize / 2,
        y: tileSize * i + tileSize / 2,
      });
    });
  });

  const tileTexture: any = useLoader(THREE.TextureLoader, tileImages);

  return (
    <Suspense fallback={null}>
      {tilesPosition.map((position: any, index: any) => {
        return (
          <mesh
            key={index}
            position={[position.x, position.y, 0]}
            onPointerDown={pointerDownOnTile}
            onPointerMove={pointerMoveOnTile}
          >
            <planeBufferGeometry attach="geometry" args={[tileSize, tileSize]} />
            {tileTexture && <meshBasicMaterial attach="material" map={tileTexture[index] as THREE.Texture} />}
          </mesh>
        );
      })}
    </Suspense>
  );
};
