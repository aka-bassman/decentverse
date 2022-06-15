import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { Bodies, Engine, World } from "matter-js";
import { Socket as Soc } from "socket.io-client";

export interface CallRoomProp {
  interaction: scalar.Interaction;
  socket: Soc;
}
export const CallRoom = React.memo(({ interaction, socket }: CallRoomProp) => {
  const [width, height] = [
    interaction.topLeft[0] - interaction.bottomRight[0],
    interaction.bottomRight[1] - interaction.topLeft[1],
  ];
  const me = useWorld((state) => state.me);
  useEffect(() => {
    console.log(me.render.position);
    return () => {
      // World.remove(engine.current.world, box);
    };
  }, [me.render]);

  return (
    <Suspense fallback={null}>
      {/* <mesh position={position}>
    <planeGeometry args={[width, height]} />
    <meshBasicMaterial color={0xff0000} transparent />
  </mesh> */}
    </Suspense>
  );
});
