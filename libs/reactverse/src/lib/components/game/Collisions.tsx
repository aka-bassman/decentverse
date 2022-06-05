import React, { Suspense, useRef, MutableRefObject, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
// export interface PlacementsProp {}

export const Interactions = () => {
  const interactions = useWorld((state) => state.map?.interactions);
  return (
    <Suspense fallback={null}>
      {interactions?.map((interaction, idx) => (
        <Collision key={idx} collision={interaction} />
      ))}
    </Suspense>
  );
};

export interface CollisionProp {
  collision: scalar.Interaction;
}
export const Collision = React.memo(({ collision }: CollisionProp) => {
  const position = new Vector3(
    (collision.bottomRight[0] + collision.topLeft[0]) / 2,
    (collision.bottomRight[1] + collision.topLeft[1]) / 2,
    -0.00000005
  );
  const [width, height] = [
    collision.topLeft[0] - collision.bottomRight[0],
    collision.bottomRight[1] - collision.topLeft[1],
  ];
  return (
    <Suspense fallback={null}>
      <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0xff0000} transparent />
      </mesh>
    </Suspense>
  );
});
