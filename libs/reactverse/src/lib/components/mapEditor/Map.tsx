import { Canvas } from "react-three-fiber";
import { scalar, useEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { MapTiles, MapCollisions, MapAssets, MapAssetPreview, MapWebViews, MapCallRooms } from "./";
import { Stats } from "@react-three/drei";
import { useRef } from "react";
import styled from "styled-components";

export const Map = () => {
  const mapData = useEditor((state) => state.mapData);
  const isActiveViewMode = useEditor((state) => state.isActiveViewMode);
  const viewMode = useEditor((state) => state.viewMode);

  const keyState = useRef(scalar.keyboard);
  const lockState = useRef(false);
  useKeyboard({ keyState, lockState });

  if (!mapData) return null;

  return (
    <MapContainer>
      <Canvas camera={{ fov: 75, near: 0.1, far: 4000, position: [0, 0, 2500] }}>
        <MapTiles mapData={mapData} keyboard={keyState} />
        <MapAssetPreview />
        {isActiveViewMode("Assets") && <MapAssets />}
        {isActiveViewMode("Interaction") && (
          <>
            <MapCollisions />
            <MapWebViews />
            <MapCallRooms />
          </>
        )}

        {/* <Stats /> */}
      </Canvas>
    </MapContainer>
  );
};

const MapContainer = styled.div`
  /* height: calc(100vh - 40px); */
  height: 100vh;
  background-color: #999;
`;
