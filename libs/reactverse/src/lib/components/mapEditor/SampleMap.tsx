import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { Canvas } from "react-three-fiber";
import { useMapEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { Tiles } from "./";
// import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3 } from "three";
import { Scene } from "three";
import { Button } from "antd";
// import { useTexture } from "@react-three/drei";
// import { Line } from "@react-three/drei";

import * as THREE from "three";

export const SampleMap = () => {
  const {
    isActiveViewMode,
    mapData,
    setCtxs,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseLeave,
    tileSize,
    mapWidth,
    mapHeight,
  } = useMapEditor();

  const scene = useRef<Scene>(new Scene());
  const [map, setMap] = useState();
  const [assets, setAssets] = useState([]);
  //* 맵 초기화
  useEffect(() => {
    if (!mapData) return;

    const image = mapData.tiles[0][0].bottom.url;

    // for (let i = 0; i < 5; i++) {
    //   for (let j = 0; j < 8; j++) {
    //     const image = new Image();
    //     image.src = mapData.tiles[i][j].bottom.url;
    //     image.onload = () => {
    //       mapContext?.drawImage(image, j * tileSize, i * tileSize, tileSize, tileSize);
    //     };
    //   }url.replace(
    // }
  }, [mapData]);

  const addSample = (index, e) => {
    console.log("e", e);
    // console.log("aaaa", index, e);
    // console.log("x,y", e.x, e.y);
    // console.log("offsetX, offsetY", e.offsetX, e.offsetY);
    // console.log("clientX, clientY", e.clientX, e.clientY);
    // console.log("-------");
    // setAssets((prev) => [...prev, prev.length * 200]);
    setAssets((prev) => [...prev, [e.point.x, e.point.y]]);
    // setAssets((prev) => [...prev, [e.offsetX, e.offsetY]]);
    // setAssets((prev) => [...prev, [e.clientX, e.clientY]]);
  };

  const keyboard = useKeyboard();
  // const { camera, get } = useThree();

  // const texture = useLoader(THREE.TextureLoader, "https://i.imgur.com/RoNmD7W.png");

  if (!mapData) return;

  return (
    <div>
      {/* <Button onClick={addSample}>추가</Button> */}

      <div style={{ backgroundColor: "#fff", height: "100vh" }}>
        <Canvas camera={{ fov: 75, near: 0.1, far: 4000, position: [0, 0, 3500] }}>
          <Tiles mapData={mapData} keyboard={keyboard} addSample={addSample} assets={assets} />
        </Canvas>
      </div>
    </div>
  );
};
