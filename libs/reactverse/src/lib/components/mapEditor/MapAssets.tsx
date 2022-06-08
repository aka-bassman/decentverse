import React, { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { useMapEditor, types } from "../../stores";
import { TextureLoader } from "three";

import * as THREE from "three";

export const MapAssets = () => {
  const assets = useMapEditor((state) => state.assets);

  const assetImages = assets.map((asset) => asset.top || "/transparent.png");
  const topTextures = useLoader(THREE.TextureLoader, assetImages);

  const bottomImages = assets.map((asset) => asset.bottom || "/transparent.png");
  const bottomTextures = useLoader(THREE.TextureLoader, bottomImages);

  return (
    <Suspense fallback={null}>
      {assets.map((asset, index) => (
        <MapAsset
          key={index}
          asset={asset}
          index={index}
          topTexture={topTextures[index]}
          bottomTexture={bottomTextures[index]}
        />
      ))}
    </Suspense>
  );
};

export const MapAsset = React.memo(
  ({
    asset,
    index,
    topTexture,
    bottomTexture,
  }: {
    asset: types.TAsset;
    index: number;
    topTexture: any;
    bottomTexture: any;
  }) => {
    const { clickOnAsset } = useMapEditor();
    // const loader = new TextureLoader();
    // const topTexture = asset.top && loader.load(asset.top);
    // const bottomTexture = asset.bottom && loader.load(asset.bottom);

    return (
      <Suspense fallback={null}>
        <mesh position={[asset.x, asset.y, 1]} onClick={(e) => clickOnAsset(e, index)}>
          <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
          {bottomTexture && <meshBasicMaterial attach="material" map={bottomTexture} transparent={true} />}
        </mesh>
        <mesh position={[asset.x, asset.y, 2]}>
          <planeBufferGeometry attach="geometry" args={[asset.width, asset.height]} />
          {topTexture && <meshBasicMaterial attach="material" map={topTexture} transparent={true} />}
        </mesh>
      </Suspense>
    );
  }
);
