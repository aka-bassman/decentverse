import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
// export interface PlacementsProp {}

export const Placements = () => {
  const placements = useWorld((state) => state.map?.placements);
  return (
    <Suspense fallback={null}>
      {placements?.map((placement, idx) => (
        <Placement key={idx} placement={placement} />
      ))}
    </Suspense>
  );
};

export interface PlacementProp {
  placement: types.Placement;
}
const loader = new TextureLoader();

export const Placement = React.memo(({ placement }: PlacementProp) => {
  const loaded = useWorld((state) => state.loaded);
  const bottom =
    placement.asset.bottom &&
    loader.load(placement.asset.bottom?.url.replace("https://asset.ayias.io", "ayias"), loaded);
  const top =
    placement.asset.top && loader.load(placement.asset.top?.url.replace("https://asset.ayias.io", "ayias"), loaded);
  const lighting =
    placement.asset.lighting &&
    loader.load(placement.asset.lighting?.url.replace("https://asset.ayias.io", "ayias"), loaded);

  const position = new Vector3(placement.position[0], placement.position[1], -0.00000005);
  const topPos = new Vector3(placement.position[0], placement.position[1], 0.00001);
  const [width, height] = [placement.position[2], placement.position[3]];
  return (
    <Suspense fallback={null}>
      {bottom && (
        <mesh position={position} visible={true}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={bottom} transparent />
        </mesh>
      )}
      {top && (
        <mesh position={topPos}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={top} transparent />
        </mesh>
      )}
      {lighting && (
        <mesh position={topPos}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={lighting} transparent />
        </mesh>
      )}
    </Suspense>
  );
});
