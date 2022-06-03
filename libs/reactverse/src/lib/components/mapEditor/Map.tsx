import { Suspense, useRef, MutableRefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { Canvas } from "react-three-fiber";
import { useMapEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { Tiles } from "./";

export const Map = () => {
  const { mapData } = useMapEditor();
  const keyboard = useKeyboard();

  if (!mapData) return null;

  return (
    <div>
      <div style={{ backgroundColor: "#fff", height: "100vh" }}>
        <Canvas camera={{ fov: 75, near: 0.1, far: 4000, position: [0, 0, 3500] }}>
          <Tiles mapData={mapData} keyboard={keyboard} />
        </Canvas>
      </div>
    </div>
  );
};
