import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar } from "../../stores";
import { Sprite, SpriteMaterial, Vector3 } from "three";
import { useKeyboard, useGameConnection, useWindowDimensions } from "../../hooks";
import { TileMap, Player, Players, Placements, Collisions, Webviews, CallRooms, Overlay } from "./index";
import { Socket as Soc } from "socket.io-client";
import { Engine, Render, Bodies, World } from "matter-js";

export interface GameProps {
  socket: Soc;
}

export const Game = ({ socket }: GameProps) => {
  const initWorld = useWorld((state) => state.initWorld);
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
    id: "",
    position: [5000, 5000],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  const scope = useRef<types.WorldScope>({
    min: [0, 0],
    max: [2048, 2048],
  });
  const position_ = new Vector3(0, 0, 3);
  const interaction = useRef<types.InteractionState>(types.defaultInteractionState);
  useGameConnection({ player, scope, socket });
  useWindowDimensions();
  return (
    <div
      style={{
        width: "200%",
        height: "200%",
        marginLeft: "-50%",
        marginTop: "-30%",
      }}
    >
      {/* <Canvas camera={{ fov: 100, near: 1, far: 3000, position: [0, 0, 2500], zoom: 1 }}> */}
      <Canvas orthographic camera={{ zoom: 0.5 }} frameloop="always">
        <Suspense fallback={null}>
          <Player sprite={sprite} animation={animation} keyboard={keyboard} player={player} engine={engine} />
          <TileMap player={player} scope={scope} />
          <Players playerId={player.current.id} />
          <Placements />
          <Collisions engine={engine} />
          <Webviews engine={engine} interaction={interaction} player={player} />
          <CallRooms socket={socket} engine={engine} interaction={interaction} player={player} />
          <Overlay />
        </Suspense>
      </Canvas>
    </div>
  );
};
