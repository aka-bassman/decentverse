import { useState, useEffect, Suspense } from "react";
import { useThree, Canvas, useLoader } from "@react-three/fiber";
import { useWorld } from "../stores";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { useTexture, Html, useProgress } from "@react-three/drei";
function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}
// import * as THREE from "three";
// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Map = () => {
  const tiles = useWorld((state) => state.render.tiles);
  const [tile] = useTexture([tiles[0][0].bottom.url.split("/").slice(-2).join("/")]);

  return (
    <Suspense fallback={<Loader />}>
      <sprite>
        <planeGeometry args={[7.5, 7.5]} />
        <spriteMaterial map={tile} />
      </sprite>
    </Suspense>
  );
};
useTexture.preload("/decentverse/azure-sky.png");
