import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar } from "../../stores";
import { Sprite, SpriteMaterial } from "three";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../../hooks";
import { TileMap, Player, Players, Placements, Interactions } from "./index";
import { Socket as Soc } from "socket.io-client";
import { Engine, Render, Bodies, World } from "matter-js";

export interface GameProps {
  socket: Soc;
}

export const Game = ({ socket }: GameProps) => {
  const initWorld = useWorld((state) => state.initWorld);
  const userId = useWorld((state) => state.me.userId);
  const scene = useRef();
  const engine = useRef(Engine.create());
  useEffect(() => {
    (async () => {
      await initWorld();
    })();
  }, []);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const keyboard = useKeyboard();

  const player = useRef<RenderCharacter>({
    id: userId,
    position: [5000, 5000],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  const scope = useRef<types.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  useGameConnection({ player, scope, socket });
  useWindowDimensions();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginLeft: "0%",
        marginTop: "0%",
        borderColor: "black",
        borderWidth: 2,
      }}
    >
      <Canvas camera={{ fov: 50, near: 0.1, far: 3000, position: [0, 0, 2500], zoom: 1 }}>
        <Suspense fallback={null}>
          <TileMap player={player} scope={scope} />
          <Player sprite={sprite} animation={animation} keyboard={keyboard} player={player} engine={engine} />
          <Players playerId={player.current.id} />
          <Placements />
          <Interactions engine={engine} />
        </Suspense>
      </Canvas>
    </div>
  );
};
