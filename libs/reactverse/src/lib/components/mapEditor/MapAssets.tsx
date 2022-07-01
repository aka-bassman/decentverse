import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { useEditor, types, useGame } from "../../stores";
import { TextureLoader } from "three";

import * as THREE from "three";

export const MapAssets = () => {
  const assets = useEditor((state) => state.assets);
  return (
    <Suspense fallback={null}>
      {assets.map((asset) => (
        <MapAsset key={asset.placeId} asset={asset} />
      ))}
    </Suspense>
  );
};

export const MapAsset = React.memo(({ asset }: { asset: types.TAsset }) => {
  const clickOnItem = useEditor((state) => state.clickOnItem);
  const loader = new TextureLoader();
  const topTexture = asset.top && loader.load(asset.top);
  const bottomTexture = asset.bottom && loader.load(asset.bottom);
  const lockKey = useGame((state) => state.lockKey);

  const selectItem = (placeId: string) => {
    lockKey(false);
    clickOnItem(placeId);
  };

  return (
    <Suspense fallback={null}>
      <mesh position={[asset.x, asset.y, 1]} onClick={(e) => selectItem(asset.placeId)}>
        <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
        {bottomTexture && <meshBasicMaterial attach="material" map={bottomTexture} transparent={true} />}
      </mesh>
      <mesh position={[asset.x, asset.y, 2]}>
        <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
        {topTexture && <meshBasicMaterial attach="material" map={topTexture} transparent={true} />}
      </mesh>
    </Suspense>
  );
});
