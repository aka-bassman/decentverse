import { useState, useEffect, Suspense, useRef } from "react";
import { useFrame, Canvas, useLoader } from "@react-three/fiber";
import { useWorld, RenderCharacter } from "../stores";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Material, Sprite, SpriteMaterial } from "three";
import { useTexture, Html, useProgress } from "@react-three/drei";
import { useKeyboard } from "../hooks";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Player = ({ children }: any) => {
  const me = useWorld((state) => state.me);
  const [url] = useTexture([
    "https://media.discordapp.net/attachments/975326008951578674/976139286518825010/akacity.jpg?width=1551&height=1357",
    // me?.character.right.idle.url.split("/").slice(-2).join("/") ?? ""
  ]);
  const spriteRef = useRef<Sprite>(null);
  const materialRef = useRef<SpriteMaterial>(null);
  const keyboard = useKeyboard();

  const player = useRef<RenderCharacter>({
    src: me?.character.right.idle.url ?? "",
    flip: false,
    position: [0, 0],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  useFrame(() => {
    if (!spriteRef.current || !me || !materialRef.current?.map) return;
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
      : me.render.direction;
    const flip = keyboard.current.left && !me.character.left ? true : keyboard.current.right ? false : me.render.flip;
    const character = me.character as any;
    const src = character[direction][characterState].url;
    player.current = { src, flip, position, velocity, direction, state: characterState };
    // spriteRef.current.position.x = position[0] * 0.01;
    // spriteRef.current.position.y = position[1] * 0.01;
    spriteRef.current.translateX(velocity[0] * 0.01);
    spriteRef.current.translateY(velocity[1] * 0.01);
    // spriteRef.current.scale.setX(1);

    materialRef.current.map.flipY = false;
  });
  console.log("player render");

  return (
    <Suspense fallback={null}>
      <sprite ref={spriteRef}>
        <planeGeometry args={[1, 1]} />
        <spriteMaterial ref={materialRef} map={url} />
      </sprite>
    </Suspense>
  );
};
