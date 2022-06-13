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
  useEffect(() => {
    return () => {
      // World.remove(engine.current.world, box);
    };
  }, []);

  return;
});
