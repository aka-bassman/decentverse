import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useWorld, RenderCharacter, scalar, useGame } from "../../stores";
import { Sprite, SpriteMaterial, Renderer } from "three";
import { useTexture, Text } from "@react-three/drei";
import { useDuration, createTileTextureAnimator } from "../../hooks";
import { Engine } from "matter-js";

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
  useEffect(() => {
    console.log("wip");
  }, []);
  useFrame(() => {
    if (!sprite.current || !me) return;
    const velocity = [
      keyboard.current.right ? me.maxSpeed : keyboard.current.left ? -me.maxSpeed : 0,
      keyboard.current.down ? -me.maxSpeed : keyboard.current.up ? me.maxSpeed : 0,
    ];
    const position = [player.current.position[0] + velocity[0], player.current.position[1] + velocity[1]];
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
    player.current = { id: player.current.id, position, velocity, direction, state: characterState };
    sprite.current.translateX(velocity[0]);
    sprite.current.translateY(velocity[1]);
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
          {player.current.id}
        </Text>
      </sprite>
    </Suspense>
  );
};
