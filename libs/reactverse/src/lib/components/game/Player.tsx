import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useWorld, useUser, RenderCharacter, scalar, useGame, world } from "../../stores";
import { Sprite, SpriteMaterial, Renderer } from "three";
import { useTexture, Text } from "@react-three/drei";
import { useDuration, createTileTextureAnimator } from "../../hooks";
import { Engine, World, Bodies, Vector, Body } from "matter-js";

export interface PlayerProp {
  sprite: MutableRefObject<Sprite | null>;
  animation: MutableRefObject<scalar.SpriteDef>;
  keyboard: MutableRefObject<scalar.Keyboard>;
  player: MutableRefObject<RenderCharacter>;
  engine: MutableRefObject<Engine>;
}

export const Player = ({ sprite, animation, keyboard, player, engine }: PlayerProp) => {
  const { camera, get, set } = useThree();
  const me = useWorld((state) => state.me);
  const iam = useUser((state) => state);
  const [url] = useTexture([`ayias/decentverse/character/chinchin.png?id=${player.current.id}`]);
  const body = useRef<Matter.Body>(Bodies.rectangle(me.render.position[0], me.render.position[1], 120, 165));
  useEffect(() => {
    World.add(engine.current.world, body.current);
    engine.current.gravity.scale = 0;
    const position = get().camera.position;
    const playerPosition = player.current.position;

    camera.position.setX(playerPosition[0]);
    camera.position.setY(playerPosition[1]);
    return () => {
      World.remove(engine.current.world, body.current);
    };
  }, []);
  useFrame(() => {
    if (!sprite.current || !me) return;
    const velocity = [
      keyboard.current.right ? me.maxSpeed : keyboard.current.left ? -me.maxSpeed : 0,
      keyboard.current.down ? -me.maxSpeed : keyboard.current.up ? me.maxSpeed : 0,
    ];
    Body.setVelocity(body.current, { x: velocity[0], y: velocity[1] });

    engine.current = Engine.update(engine.current);

    const characterState = velocity[0] === 0 && velocity[1] === 0 ? "idle" : "walk";
    const direction = keyboard.current.right
      ? "right"
      : keyboard.current.left && me.character.left
      ? "left"
      : keyboard.current.up && me.character.up
      ? "up"
      : keyboard.current.down && me.character.down
      ? "down"
      : player.current.direction;
    player.current = {
      id: player.current.id,
      position: [body.current.position.x, body.current.position.y],
      velocity,
      direction,
      state: characterState,
    };
    sprite.current.position.x = body.current.position.x;
    sprite.current.position.y = body.current.position.y;
    const character = me.character as any;
    animation.current = character[player.current.direction][player.current.state];
  });
  const animator = createTileTextureAnimator(url, [240, 330]);
  useDuration((p) => {
    animator([animation.current.row, p]);
  }, animation);

  useFrame(() => {
    const position = get().camera.position;
    const playerPosition = player.current.position;
    const x = Math.floor((playerPosition[0] - position.x) / 10);
    const y = Math.floor((playerPosition[1] - position.y) / 10);

    if (x === 0 && y === 0) return;
    camera.translateX(x);
    camera.translateY(y);
    // camera.position.setX(x);
    // camera.position.setY(y);
  });

  return (
    <Suspense fallback={null}>
      <sprite ref={sprite}>
        <planeGeometry args={[120, 165]} />
        <Text lineHeight={0.8} position={[0, 120, 1]} fontSize={60} material-toneMapped={false}>
          {iam.nickname}
        </Text>
        <spriteMaterial map={url} />
        {/* <planeGeometry>
        </planeGeometry> */}
      </sprite>
    </Suspense>
  );
};
