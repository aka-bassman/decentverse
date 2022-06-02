import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { Canvas, useLoader, useFrame, useThree } from "react-three-fiber";
import { useMapEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3 } from "three";
import { useTexture } from "@react-three/drei";
import { Line } from "@react-three/drei";

import * as THREE from "three";

export const Tiles = ({ mapData, keyboard }: any) => {
  const { camera, get } = useThree();

  useFrame(() => {
    const position = get().camera.position;
    const offest = 40;
    keyboard.current.right && camera.translateX(offest);
    keyboard.current.left && camera.translateX(-1 * offest);
    keyboard.current.up && camera.translateY(offest);
    keyboard.current.down && camera.translateY(-1 * offest);
  });

  const texture = useLoader(THREE.TextureLoader, mapData.tiles[0][0].bottom.url);

  return (
    <>
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => console.log("click", e)}
        // onPointerMove={(e) => console.log("move", e)}
      >
        <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
        <meshBasicMaterial attach="material" map={texture as THREE.Texture} />
      </mesh>
      {/* <mesh
        position={[2000, 0, 0]}
        onClick={(e) => console.log("click", e)}
        // onPointerMove={(e) => console.log("move", e)}
      >
        <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh>
      <mesh
        position={[4000, 0, 0]}
        onClick={(e) => console.log("click", e)}
        // onPointerMove={(e) => console.log("move", e)}
      >
        <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
        <meshBasicMaterial attach="material" map={texture} />
      </mesh> */}
    </>
  );
};
