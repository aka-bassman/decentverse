import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar } from "../stores";
import { Sprite, SpriteMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useKeyboard, useDuration, createTileTextureAnimator, useInterval } from "../hooks";
import { TileMap, Player, Socket, Loop, Screen, Players } from "./index";
import { Socket as Soc } from "socket.io-client";

export interface GameProps {
  socket: Soc;
}

export const Game = ({ socket }: GameProps) => {
  const initWorld = useWorld((state) => state.initWorld);
  useEffect(() => {
    (async () => {
      await initWorld();
    })();
  }, []);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const keyboard = useKeyboard();
  const player = useRef<RenderCharacter>({
    id: `${Math.random()}`,
    position: [0, 0],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  const scope = useRef<types.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  return (
    <div style={{ width: 1500, height: 1500 }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 3000, position: [0, 0, 2500] }}>
        <Suspense fallback={null}>
          <TileMap player={player} scope={scope} />
          <Player sprite={sprite} animation={animation} keyboard={keyboard} player={player} />
          <Players playerId={player.current.id} />
        </Suspense>
      </Canvas>
      <Socket uri="localhost:3333" player={player} scope={scope} socket={socket} />
      <Screen />
    </div>
  );
};
