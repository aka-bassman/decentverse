import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useWorld, RenderCharacter, scalar, useGame, world, useGossip, useUser } from "../../stores";
import { Sprite, SpriteMaterial, Renderer } from "three";
import { useTexture, Text, Html } from "@react-three/drei";
import { useDuration, createTileTextureAnimator, useInterval } from "../../hooks";
import { Engine, World, Bodies, Vector, Body } from "matter-js";
import { isMobile } from "react-device-detect";

export interface PlayerProp {
  sprite: MutableRefObject<Sprite | null>;
  animation: MutableRefObject<scalar.SpriteDef>;
  keyboard: MutableRefObject<scalar.Keyboard>;
  player: MutableRefObject<RenderCharacter>;
  engine: MutableRefObject<Engine>;
}

export const Player = ({ sprite, animation, keyboard, player, engine }: PlayerProp) => {
  const { camera, get, set } = useThree();
  const nickname = useUser((state) => state.nickname);
  const me = useWorld((state) => state.me);
  const renderMe = useWorld((state) => state.renderMe);
  const [url] = useTexture([`ayias/decentverse/character/chinchin.png?id=${player.current.id}`]);
  const body = useRef<Matter.Body>(Bodies.rectangle(renderMe.position[0], renderMe.position[1], 120, 165));
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

  // useInterval(() => {}, 5000);
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
  });
  return (
    <Suspense fallback={null}>
      <sprite ref={sprite}>
        <planeGeometry args={[120, 165]} />
        <spriteMaterial map={url} />
        <Text
          lineHeight={0.8}
          position={[0, -120, 1]}
          fontSize={40}
          maxWidth={10}
          overflowWrap="normal"
          material-toneMapped={false}
        >
          {nickname}
        </Text>
        <MyChat />
      </sprite>
    </Suspense>
  );
};
const MyChat = () => {
  const myChat = useWorld((state) => state.myChat);
  const isTalk = useGossip((state) => state.callRoom.isTalk);
  const speechBubble = useTexture("./speechBubble.png");
  return (
    <>
      <Html
        center
        style={{
          backgroundColor: `rgba(255,255,255,${myChat.length ? 0.7 : 0})`,
          maxWidth: 300,
          width: "max-content",
          borderRadius: 10,
          bottom: isMobile ? 10 : 35,
          padding: 10,
          alignContent: "center",
          alignItems: "center",
          wordWrap: "normal",
        }}
      >
        {myChat}
      </Html>
      <sprite position={[60, 150, 1]}>
        <planeGeometry args={isTalk && !myChat.length ? [120, 125] : [0, 0]} />
        <spriteMaterial map={speechBubble} />
      </sprite>
    </>
  );
};
