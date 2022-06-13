import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Socket as Soc } from "socket.io-client";
import { Collision, CallRoom } from ".";
import { Bodies, Engine, World } from "matter-js";
export interface InteractionsProp {
  engine: MutableRefObject<Engine>;
  socket: Soc;
}

export const Interactions = ({ engine, socket }: InteractionsProp) => {
  const interactions = useWorld((state) => state.map?.interactions);
  return (
    <Suspense fallback={null}>
      {interactions?.map((interaction, idx) => {
        console.log(interaction.type);
        if (interaction.type === "collision") return <Collision key={idx} collision={interaction} engine={engine} />;
        else if (interaction.type === "callRoom")
          return <CallRoom key={idx} interaction={interaction} socket={socket} />;
      })}
    </Suspense>
  );
};
