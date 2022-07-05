import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { useEditor, types, useGame } from "../../stores";
import { TextureLoader } from "three";

export const MapTopAssets = () => {
  const assets = useEditor((state) => state.assets);
  return (
    <Suspense fallback={null}>
      {assets.map((asset) => (
        <MapTopAsset key={asset.placeId} asset={asset} />
      ))}
    </Suspense>
  );
};

export const MapTopAsset = React.memo(({ asset }: { asset: types.TAsset }) => {
  const loader = new TextureLoader();
  const topTexture = asset.top && loader.load(asset.top);

  return (
    <Suspense fallback={null}>
      <mesh position={[asset.x, asset.y, 2]}>
        <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
        {topTexture && <meshBasicMaterial attach="material" map={topTexture} transparent={true} />}
      </mesh>
    </Suspense>
  );
});
