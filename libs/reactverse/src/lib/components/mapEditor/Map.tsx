import { Canvas } from "@react-three/fiber";
import { useMapEditor } from "../../stores";
import { useKeyboard } from "../../hooks";
import { MapTiles, MapCollisions, MapAssets, MapAssetPreview } from "./";
import { Stats } from "@react-three/drei";

export const Map = () => {
  const { mapData, isActiveViewMode } = useMapEditor();
  const keyboard = useKeyboard();

  if (!mapData) return null;

  return (
    <div>
      <div style={{ backgroundColor: "#fff", height: "100vh" }}>
        <Canvas camera={{ fov: 75, near: 0.1, far: 4000, position: [0, 0, 2500] }}>
          <MapTiles mapData={mapData} keyboard={keyboard} />
          <MapAssetPreview />
          {isActiveViewMode("Assets") && <MapAssets />}
          {isActiveViewMode("Interaction") && <MapCollisions />}
          <Stats />
        </Canvas>
      </div>
    </div>
  );
};
