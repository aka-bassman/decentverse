import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import {
  Group,
  Scene,
  Sprite,
  SpriteMaterial,
  Vector,
  Vector3,
  TextureLoader,
  MeshBasicMaterial,
  AmbientLight,
} from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { Bodies, Engine, World } from "matter-js";
export interface CallRoomsProp {
  engine: MutableRefObject<Engine>;
  interaction: MutableRefObject<types.InteractionState>;
  player: MutableRefObject<types.RenderCharacter>;
}
export const CallRooms = ({ engine, interaction, player }: CallRoomsProp) => {
  const callRooms = useWorld((state) => state.map?.callRooms);
  const joinInteraction = useWorld((state) => state.joinInteraction);
  const leaveInteraction = useWorld((state) => state.leaveInteraction);
  useInterval(() => {
    if (interaction.current.callRoom) {
      if (
        interaction.current.callRoom.topLeft[0] < player.current.position[0] &&
        player.current.position[0] < interaction.current.callRoom.bottomRight[0] &&
        interaction.current.callRoom.topLeft[1] > player.current.position[1] &&
        player.current.position[1] > interaction.current.callRoom.bottomRight[1]
      )
        return;
      interaction.current.callRoom = null;
      console.log("leave call room");
      leaveInteraction("callRoom");
    } else {
      callRooms?.map((callroom) => {
        if (
          callroom.topLeft[0] < player.current.position[0] &&
          player.current.position[0] < callroom.bottomRight[0] &&
          callroom.topLeft[1] > player.current.position[1] &&
          player.current.position[1] > callroom.bottomRight[1]
        ) {
          interaction.current.callRoom = callroom;
          console.log("join call room", callroom);
          joinInteraction("callRoom", callroom);
        }
      });
    }
  }, 500);

  return (
    <Suspense fallback={null}>
      {callRooms?.map((callRoom, idx) => (
        <CallRoom key={idx} callRoom={callRoom} engine={engine} />
      ))}
    </Suspense>
  );
};

export interface CallRoomProp {
  callRoom: scalar.CallRoom;
  engine: MutableRefObject<Engine>;
}
export const CallRoom = React.memo(({ callRoom }: CallRoomProp) => {
  const light = useRef<AmbientLight | undefined>();
  const position = new Vector3(
    (callRoom.bottomRight[0] + callRoom.topLeft[0]) / 2,
    (callRoom.bottomRight[1] + callRoom.topLeft[1]) / 2,
    -0.00000005
  );

  const [width, height] = [
    callRoom.topLeft[0] - callRoom.bottomRight[0],
    callRoom.bottomRight[1] - callRoom.topLeft[1],
  ];

  return (
    <Suspense fallback={null}>
      {/* <directionalLight ref={light} intensity={0.8} color={0xffff00} /> */}

      <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0x00ff00} transparent />
      </mesh>
    </Suspense>
  );
});
