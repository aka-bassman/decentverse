import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { useMapEditor } from "../../stores";

import * as THREE from "three";

export const Tiles = ({ mapData, keyboard }: any) => {
  const { camera, get } = useThree();

  const {
    isActiveViewMode,
    mapData,
    tileSize,
    pointerMoveOnTile,
    pointerDownOnTile,
    pointerUpOnTile,
    preview,
    assets,
    collisions,
    clickOnCollision,
    collisionPreview,
  } = useMapEditor();

  useFrame(() => {
    const position = get().camera.position;
    const offest = 80;
    keyboard.current.right && camera.translateX(offest);
    keyboard.current.left && camera.translateX(-1 * offest);
    keyboard.current.up && camera.translateY(offest);
    keyboard.current.down && camera.translateY(-1 * offest);
  });

  const tileImages = [];
  const tilesPosition = [];
  mapData?.tiles.forEach((cur, i) => {
    cur.forEach((tile, j) => {
      tileImages.push(tile.bottom.url.replace("https://asset.ayias.io/", "ayias/"));
      tilesPosition.push({
        i: i,
        j: j,
        x: tileSize * j + tileSize / 2,
        y: tileSize * i + tileSize / 2,
      });
    });
  });

  const tileTexture = useLoader(THREE.TextureLoader, tileImages);
  const previewTexture = useLoader(THREE.TextureLoader, preview.image || "https://i.imgur.com/RoNmD7W.png");

  const assetImages = assets.map((asset) => asset.image);
  const assetTexture = useLoader(THREE.TextureLoader, assetImages || ["https://i.imgur.com/RoNmD7W.png"]);

  return (
    <Suspense fallback={null}>
      {tilesPosition.map((position, index) => {
        return (
          <mesh
            key={index}
            position={[position.x, position.y, 0]}
            onPointerDown={pointerDownOnTile}
            onPointerMove={pointerMoveOnTile}
            onPointerUp={pointerUpOnTile}
          >
            <planeBufferGeometry attach="geometry" args={[tileSize, tileSize]} />
            <meshBasicMaterial attach="material" map={tileTexture[index] as THREE.Texture} />
          </mesh>
        );
      })}

      {preview.isPreview && (
        <sprite position={[preview.x, preview.y, 0]}>
          <planeGeometry args={[preview.width, preview.height]} />
          <spriteMaterial map={previewTexture} />
        </sprite>
      )}

      {/* {assets.map((asset, index) => (
        <mesh key={index} position={[asset.x, asset.y, 0]} onClick={(e) => clickOnAsset(e, index)}>
          <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
          <meshBasicMaterial attach="material" map={assetTexture[index]} />
        </mesh>
      ))} */}

      {assets.map((asset, index) => (
        <sprite key={index} position={[asset.x, asset.y, 0]}>
          <planeGeometry args={[asset.width, asset.height]} />
          <spriteMaterial map={assetTexture[index]} />
        </sprite>
      ))}

      <ambientLight />
      {collisionPreview.isPreview && (
        <mesh position={[collisionPreview.x, collisionPreview.y, 0]}>
          {console.log("x,y,w,h", collisionPreview)}
          <planeBufferGeometry attach="geometry" args={[collisionPreview.width, collisionPreview.height]} />
          <meshPhongMaterial attach="material" color="#f19c9c" />
        </mesh>
      )}

      {collisions.map((collision, index) => (
        <mesh key={index} position={[collision.x, collision.y, 0]} onClick={(e) => clickOnCollision(e, index)}>
          <planeBufferGeometry attach="geometry" args={[collision.width, collision.height]} />
          <meshPhongMaterial attach="material" color="#FF6666" />
        </mesh>
      ))}
    </Suspense>
  );
};
