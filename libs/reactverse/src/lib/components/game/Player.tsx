import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useWorld, RenderCharacter, scalar, useGame, world } from "../../stores";
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
  const { camera, get } = useThree();
  const me = useWorld((state) => state.me);
  const [url] = useTexture(["/sprite5.png"]);
  const body = useRef<Matter.Body>(Bodies.rectangle(me.render.position[0], me.render.position[1], 129, 194));
  useEffect(() => {
    World.add(engine.current.world, body.current);
    engine.current.gravity.scale = 0;
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
    // console.log(player.current.)
    // const position = [player.current.position[0] + velocity[0], player.current.position[1] + velocity[1]];
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
  const animator = createTileTextureAnimator(url, [129, 194]);
  useDuration((p) => {
    animator([animation.current.row, p]);
  }, animation);
  useFrame(() => {
    const position = get().camera.position;
    const playerPosition = player.current.position;
    camera.translateX(Math.floor((playerPosition[0] - position.x) / 10));
    camera.translateY(Math.floor((playerPosition[1] - position.y) / 10));
  });

  return (
    <Suspense fallback={null}>
      <sprite ref={sprite}>
        <planeGeometry args={[129, 194]} />
        <spriteMaterial map={url} />
        <Text lineHeight={0.8} position={[0, 120, 1]} fontSize={60} material-toneMapped={false}>
          {me.userId}
        </Text>
      </sprite>
    </Suspense>
  );
};
