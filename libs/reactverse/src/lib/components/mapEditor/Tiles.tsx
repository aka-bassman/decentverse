import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";

import * as THREE from "three";

export const Tiles = ({ mapData, keyboard, addSample, assets }: any) => {
  const { camera, get } = useThree();

  useFrame(() => {
    const position = get().camera.position;
    const offest = 80;
    keyboard.current.right && camera.translateX(offest);
    keyboard.current.left && camera.translateX(-1 * offest);
    keyboard.current.up && camera.translateY(offest);
    keyboard.current.down && camera.translateY(-1 * offest);
  });

  // console.log(mapData.tiles[0][0].bottom.url);

  console.log("mapData.tiles", mapData.tiles.length);
  const tileImages = [];
  const tilesPosition = [];
  mapData.tiles.forEach((cur, i) => {
    cur.forEach((tile, j) => {
      tileImages.push(
        tile.bottom.url.replace("https://dev.akamir.s3.ap-northeast-2.amazonaws.com/decentverse/", "decentverse/")
      );
      tilesPosition.push({
        i: i,
        j: j,
        x: 2000 * i,
        y: 2000 * j * -1,
      });
    });
  });

  const texture = useLoader(THREE.TextureLoader, tileImages);

  return (
    <>
      {tilesPosition.map((position, index) => {
        return (
          <mesh
            position={[position.x, position.y, 0]}
            onClick={(e) => addSample(index, e)}
            onPointerMove={(e) => console.log(e.point)}
          >
            <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
            <meshBasicMaterial attach="material" map={texture[index] as THREE.Texture} />
          </mesh>
        );
      })}

      {assets.map((cur, index) => (
        <mesh
          key={index}
          position={[cur[0], cur[1], 0]}
          onClick={(e) => console.log("asset-click", e)}
          // onPointerMove={(e) => console.log("move", e)}
        >
          <planeBufferGeometry attach="geometry" args={[200, 200]} />
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
      ))}
    </>
  );
};
