import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useDialog, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { Bodies, Engine, World } from "matter-js";
export interface ObjectsProp {
  engine: MutableRefObject<Engine>;
}
export const Objects = ({ engine }: ObjectsProp) => {
  const objects = useDialog((state) => state.dialogs);

  return (
    <Suspense fallback={null}>
      {objects?.map((object, idx) => (
        <Object key={idx} object={object} engine={engine} />
      ))}
    </Suspense>
  );
};

export interface ObjectProp {
  object: scalar.Dialog;
  engine: MutableRefObject<Engine>;
}
export const Object = React.memo(({ object, engine }: ObjectProp) => {
  const position = new Vector3(
    (object.bottomRight[0] + object.topLeft[0]) / 2,
    (object.bottomRight[1] + object.topLeft[1]) / 2,
    -0.00000005
  );
  const [width, height] = [object.topLeft[0] - object.bottomRight[0], object.bottomRight[1] - object.topLeft[1]];

  useEffect(() => {
    const box = Bodies.rectangle(position.x, position.y, width, height, { isStatic: true });
    World.add(engine.current.world, box);

    return () => {
      World.remove(engine.current.world, box);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      {/* <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0xff0000} transparent />
      </mesh> */}
    </Suspense>
  );
});
