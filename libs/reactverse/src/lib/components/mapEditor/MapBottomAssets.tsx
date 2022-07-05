import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { useEditor, types, useGame } from "../../stores";
import { TextureLoader } from "three";

export const MapBottomAssets = () => {
  const assets = useEditor((state) => state.assets);
  return (
    <Suspense fallback={null}>
      {assets.map((asset) => (
        <MapBottomAsset key={asset.placeId} asset={asset} />
      ))}
    </Suspense>
  );
};

export const MapBottomAsset = React.memo(({ asset }: { asset: types.TAsset }) => {
  const clickOnItem = useEditor((state) => state.clickOnItem);
  const loader = new TextureLoader();
  const bottomTexture = asset.bottom && loader.load(asset.bottom);
  const lockKey = useGame((state) => state.lockKey);
  const isActiveViewMode = useEditor((state) => state.isActiveViewMode);

  const selectItem = (placeId: string) => {
    lockKey(false);
    clickOnItem(placeId);
  };

  return (
    <Suspense fallback={null}>
      {isActiveViewMode("AssetBottom") && (
        <mesh position={[asset.x, asset.y, 1.1]} onClick={(e) => selectItem(asset.placeId)}>
          <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
          {bottomTexture && <meshBasicMaterial attach="material" map={bottomTexture} transparent={true} />}
        </mesh>
      )}
    </Suspense>
  );
});
