import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame, useGossip } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { Bodies, Engine, World } from "matter-js";
import { Socket } from "socket.io-client";
export interface CallRoomsProp {
  engine: MutableRefObject<Engine>;
  interaction: MutableRefObject<types.InteractionState>;
  player: MutableRefObject<types.RenderCharacter>;
  socket: Socket;
}
export const CallRooms = ({ engine, interaction, player, socket }: CallRoomsProp) => {
  const callRooms = useWorld((state) => state.map?.callRooms);
  const joinCallRoom = useGossip((state) => state.joinCallRoom);
  const leaveCallRoom = useGossip((state) => state.leaveCallRoom);
  const joinInteraction = useWorld((state) => state.joinInteraction);
  const leaveInteraction = useWorld((state) => state.leaveInteraction);
  const receiveChat = useGossip((state) => state.receiveChat);
  useInterval(() => {
    if (interaction.current.callRoom) {
      if (
        interaction.current.callRoom.topLeft[0] < player.current.position[0] &&
        player.current.position[0] < interaction.current.callRoom.bottomRight[0] &&
        interaction.current.callRoom.topLeft[1] > player.current.position[1] &&
        player.current.position[1] > interaction.current.callRoom.bottomRight[1]
      )
        return;
      leaveInteraction("callRoom");
      leaveCallRoom();
      socket.off(`chat:${getAreaId(interaction.current.callRoom)}`);
      interaction.current.callRoom = null;
    } else {
      callRooms?.map((callRoom) => {
        if (
          callRoom.topLeft[0] < player.current.position[0] &&
          player.current.position[0] < callRoom.bottomRight[0] &&
          callRoom.topLeft[1] > player.current.position[1] &&
          player.current.position[1] > callRoom.bottomRight[1]
        ) {
          interaction.current.callRoom = callRoom;
          joinInteraction("callRoom", callRoom);
          joinCallRoom(callRoom.roomId);
          socket.on(`chat:${getAreaId(interaction.current.callRoom)}`, (c: types.Chat) => receiveChat("callRoom", c));
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
      {/* <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0x00ff00} transparent />
      </mesh> */}
    </Suspense>
  );
});

const getAreaId = (callRoom: types.scalar.CallRoom) =>
  callRoom
    ? `${callRoom.topLeft[0]}/${callRoom.topLeft[1]}/${callRoom.bottomRight[0]}/${callRoom.bottomRight[1]}`
    : "default";
