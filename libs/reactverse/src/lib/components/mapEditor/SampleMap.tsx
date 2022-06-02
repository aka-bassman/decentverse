import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { Canvas } from "react-three-fiber";
import { useMapEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { Tiles } from "./";
// import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3 } from "three";
import { Scene } from "three";

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
    //   }
    // }
  }, [mapData]);

  const keyboard = useKeyboard();
  // const { camera, get } = useThree();

  // const texture = useLoader(THREE.TextureLoader, "https://i.imgur.com/RoNmD7W.png");

  if (!mapData) return;

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 6000, position: [0, 0, 3500] }}>
        <Tiles mapData={mapData} keyboard={keyboard} />
      </Canvas>
    </div>
  );

  return (
    <div style={{ width: 2500, height: 1500, backgroundColor: "#fff" }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 6000, position: [0, 0, 3500] }}>
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => console.log("click", e)}
          // onPointerMove={(e) => console.log("move", e)}
        >
          {/* 사각평면 */}
          <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
          {/* 조명을 고려하지 않음 */}
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
        <mesh
          position={[2000, 0, 0]}
          onClick={(e) => console.log("click", e)}
          // onPointerMove={(e) => console.log("move", e)}
        >
          {/* 사각평면 */}
          <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
          {/* 조명을 고려하지 않음 */}
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
        <mesh
          position={[4000, 0, 0]}
          onClick={(e) => console.log("click", e)}
          // onPointerMove={(e) => console.log("move", e)}
        >
          {/* 사각평면 */}
          <planeBufferGeometry attach="geometry" args={[2000, 2000]} />
          {/* 조명을 고려하지 않음 */}
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
      </Canvas>
    </div>
  );

  // return (
  //   // <div style={{ width: 1500, height: 1500 }}>
  //   <div>
  //     <Canvas camera={{ fov: 75, near: 0.1, far: 3000, position: [0, 0, 2500] }}>
  //       <scene ref={scene}>
  //         {/* <Canvas> */}
  //         {/* <ambientLight />
  //         <pointLight position={[10, 10, 10]} />
  //         <Box position={[-1.2, 0, 0]} />
  //         <Box position={[1.2, 0, 0]} /> */}
  //         <sprite position={[1.2, 0, 0]}>
  //           <planeGeometry args={[2000, 2000]} />
  //           <spriteMaterial map={map} />
  //         </sprite>
  //       </scene>
  //     </Canvas>
  //   </div>
  // );

  // return (
  //   <Canvas>
  //     <ambientLight />
  //     <pointLight position={[10, 10, 10]} />
  //     <Box position={[-1.2, 0, 0]} />
  //     <Box position={[1.2, 0, 0]} />
  //   </Canvas>
  // );
};

// function Box(props: any) {
//   // This reference will give us direct access to the mesh
//   const mesh = useRef();
//   // Set up state for the hovered and active state
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   // Subscribe this component to the render-loop, rotate the mesh every frame
//   // useFrame((state, delta) => (mesh?.current.rotation.x += 0.01));
//   // Return view, these are regular three.js elements expressed in JSX
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }

// const MapContainer = styled.div`
//   position: relative;
//   canvas {
//     position: absolute;
//     border: 1px solid black;
//   }
// `;
