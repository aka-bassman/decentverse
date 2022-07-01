import { Suspense, MutableRefObject, useEffect } from "react";
import styled from "styled-components";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { useEditor, scalar } from "../../stores";
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
  const { tileSize, pointerMoveOnTile, pointerDownOnTile } = useEditor();

  useEffect(() => {
    if (!mapData?.tiles.length) return;
    camera.position.setX((tileSize * mapData?.tiles[0].length) / 2);
    camera.position.setY((tileSize * mapData?.tiles.length) / 2);
  }, [mapData]);

  useFrame(() => {
    const width = tileSize * mapData?.tiles[0].length;
    const height = tileSize * mapData?.tiles.length;
    const centerX = width / 2;
    const centerY = height / 2;
    const offset = 80;

    if (
      (keyboard.current.left && camera.position.x > centerX - width / 2) ||
      (keyboard.current.right && camera.position.x < centerX + width / 2)
    ) {
      keyboard.current.right && camera.translateX(offset);
      keyboard.current.left && camera.translateX(-1 * offset);
    }

    if (
      (keyboard.current.down && camera.position.y > centerY - height / 2) ||
      (keyboard.current.up && camera.position.y < centerY + height / 2)
    ) {
      keyboard.current.up && camera.translateY(offset);
      keyboard.current.down && camera.translateY(-1 * offset);
    }
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
