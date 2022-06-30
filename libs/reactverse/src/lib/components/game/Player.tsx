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
  zoom: number;
}

export const Player = ({ sprite, animation, keyboard, player, engine, zoom }: PlayerProp) => {
  const { camera, get, set } = useThree();
  const user = useUser((state) => state.user);
  const screen = useGame((state) => state.screen);
  const me = useWorld((state) => state.me);
  const renderMe = useWorld((state) => state.renderMe);
  const [url] = useTexture([`${me.character.file.url.replace("https://asset.ayias.io", "ayias")}?id=${user.id}`]);
  const body = useRef<Matter.Body>(
    Bodies.rectangle(renderMe.position[0], renderMe.position[1], me.character.size[0], me.character.size[1])
  );
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
  const animator = createTileTextureAnimator(url, [me.character.tileSize[0], me.character.tileSize[1]]);
  //240 330
  useDuration((p) => {
    animator([animation.current.row, p]);
  }, animation);

  useFrame(() => {
    const position = get().camera.position;
    const playerPosition = player.current.position;
    const x = Math.floor((playerPosition[0] - position.x) / 10);
    const y = Math.floor((playerPosition[1] - position.y) / 10);

    const tileSize = 2000;
    const tileNums = [7, 4];

    if (x === 0 && y === 0) return;
    if (
      (x < 0 && camera.position.x > window.innerWidth / 2 / zoom) ||
      (x > 0 && tileSize * tileNums[0] - window.innerWidth / 2 / zoom > camera.position.x)
    ) {
      camera.translateX(x);
    }

    if (
      (y < 0 && camera.position.y > window.innerHeight / 2 / zoom) ||
      (y > 0 && tileSize * tileNums[1] - window.innerHeight / 2 / zoom > camera.position.y)
    ) {
      camera.translateY(y);
    }
  });
  return (
    <Suspense fallback={null}>
      <sprite ref={sprite}>
        <planeGeometry args={[me.character.size[0], me.character.size[1]]} />
        <spriteMaterial map={url} />
        <Text
          lineHeight={0.8}
          position={[0, -120, 1]}
          fontSize={40}
          maxWidth={10}
          overflowWrap="normal"
          material-toneMapped={false}
        >
          {user.nickname}
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
