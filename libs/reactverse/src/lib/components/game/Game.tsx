import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { types, useWorld, useDialog, RenderCharacter, scalar, useGame, useUser } from "../../stores";
import { Sprite, SpriteMaterial, Vector3 } from "three";
import {
  TileMap,
  Player,
  Players,
  Placements,
  Collisions,
  Webviews,
  CallRooms,
  Overlay,
  StateManagement,
} from "./index";
import { Socket as Soc } from "socket.io-client";
import { Engine, Render, Bodies, World } from "matter-js";
import styled from "styled-components";

export interface GameProps {
  socket: Soc;
}

export const Game = ({ socket }: GameProps) => {
  const nickname = useUser((state) => state.nickname);
  const initWorld = useWorld((state) => state.initWorld);
  const initDialogs = useDialog((state) => state.initDialogs);
  const screen = useGame((state) => state.screen);
  const engine = useRef(Engine.create());
  useEffect(() => {
    initWorld();
    initDialogs();
  }, []);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const player = useRef<RenderCharacter>({
    id: nickname,
    position: [5000, 5000],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  const scope = useRef<types.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  const interaction = useRef<types.InteractionState>(types.defaultInteractionState);
  const keyState = useRef(scalar.keyboard);
  const lockState = useRef(false);
  const margin = 500;

  return (
    <div
      style={
        // {
        //   width: "260%",
        //   height: "260%",
        //   marginLeft: "-80%",
        //   marginTop: "-80%",
        // }
        {
          width: "100%",
          height: "100%",
          // transform: `translate(-50%, -0%)`,

          // marginLeft: -margin,
          // marginTop: -margin,
        }
      }
    >
      <Canvas orthographic camera={{ zoom: 0.5 }} frameloop="always">
        <Suspense fallback={null}>
          <Player sprite={sprite} animation={animation} keyboard={keyState} player={player} engine={engine} />
          <TileMap player={player} scope={scope} />
          <Players playerId={player.current.id} />
          <Placements />
          <Collisions engine={engine} />
          <Webviews engine={engine} interaction={interaction} player={player} keyboard={keyState} />
          <CallRooms socket={socket} engine={engine} interaction={interaction} player={player} />
          <Overlay />
        </Suspense>
      </Canvas>
      <StateManagement keyState={keyState} lockState={lockState} player={player} socket={socket} scope={scope} />
    </div>
  );
};

// const Name = styled.div`
//   width: 200%;
//   height: 200%;
//   transform: translate(-100%, -100%);
// `;
