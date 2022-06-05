import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar } from "../../stores";
import { Sprite, SpriteMaterial } from "three";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../../hooks";
import { TileMap, Player, Players } from "./index";
import { Socket as Soc } from "socket.io-client";

export interface GameProps {
  socket: Soc;
}

export const Game = ({ socket }: GameProps) => {
  const initWorld = useWorld((state) => state.initWorld);
  const me = useWorld((state) => state.me);
  useEffect(() => {
    (async () => {
      await initWorld();
    })();
  }, []);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const keyboard = useKeyboard();

  const player = useRef<RenderCharacter>({
    id: me.userId,
    position: [0, 0],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  console.log(player.current.id);
  const scope = useRef<types.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  useGameConnection({ player, scope, socket });
  useWindowDimensions();
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 3000, position: [0, 0, 2500] }}>
        <Suspense fallback={null}>
          <TileMap player={player} scope={scope} />
          <Player sprite={sprite} animation={animation} keyboard={keyboard} player={player} />
          <Players playerId={player.current.id} />
        </Suspense>
      </Canvas>
    </div>
  );
};
