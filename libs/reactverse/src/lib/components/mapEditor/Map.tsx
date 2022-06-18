import { Canvas } from "react-three-fiber";
import { scalar, useEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { MapTiles, MapCollisions, MapAssets, MapAssetPreview, MapWebViews, MapCallRooms } from "./";
import { Stats } from "@react-three/drei";
import { useRef } from "react";

export const Map = () => {
  const { mapData, isActiveViewMode } = useEditor();
  const keyState = useRef(scalar.keyboard);
  const lockState = useRef(false);
  useKeyboard({ keyState, lockState });

  if (!mapData) return null;

  return (
    <div>
      <div style={{ backgroundColor: "#fff", height: "100vh" }}>
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
      </div>
    </div>
  );
};
