import { useState, useEffect, Suspense, useRef } from "react";
import { useFrame, Canvas, useLoader } from "@react-three/fiber";
import { useWorld, RenderCharacter } from "../stores";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Material, Sprite, SpriteMaterial, MirroredRepeatWrapping, RepeatWrapping } from "three";
import { useTexture, Html, useProgress } from "@react-three/drei";
import { useKeyboard } from "../hooks";

export function tiledToR3FTextureTranspiler(
  tileValue: number,
  imageWidth: number,
  imageHeight: number,
  tileSize: number | [number, number]
) {
  const tileSizeVector = Array.isArray(tileSize) ? tileSize : [tileSize, tileSize];

  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  const tilesAmountX = imageWidth / tileSizeVector[0];
  const tilesAmountY = imageHeight / tileSizeVector[1];

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionX = Math.floor(tileValue % tilesAmountX);

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionY = -1 + tilesAmountY - Math.floor(tileValue / tilesAmountX);

  return {
    repeat: { x: 1 / tilesAmountX, y: 1 / tilesAmountY },
    offset: {
      x: texturePositionX / tilesAmountX,
      y: texturePositionY / tilesAmountY,
    },
  };
}

export function createTileTextureAnimator(texture: THREE.Texture, tileSize: number | [number, number], startValue = 0) {
  texture.wrapS = texture.wrapT = RepeatWrapping;

  const tileSizeVector = Array.isArray(tileSize) ? tileSize : [tileSize, tileSize];

  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  const tilesAmountX = texture.image.width / tileSizeVector[0];
  const tilesAmountY = texture.image.height / tileSizeVector[1];

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionX = Math.floor(startValue % tilesAmountX);

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionY = -1 + tilesAmountY - Math.floor(startValue / tilesAmountX);

  texture.repeat.set(1 / tilesAmountX, 1 / tilesAmountY);

  texture.offset.x = texturePositionX / tilesAmountX;
  texture.offset.y = texturePositionY / tilesAmountY;

  return (value: number) => {
    const { offset } = tiledToR3FTextureTranspiler(value, texture.image.width, texture.image.height, tileSize);

    texture.offset.x = offset.x;
    texture.offset.y = offset.y;
  };
}

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Player = ({ children }: any) => {
  const me = useWorld((state) => state.me);
  const [url] = useTexture([
    "/sprite.png",
    // "https://media.discordapp.net/attachments/975326008951578674/976139286518825010/akacity.jpg?width=1551&height=1357",
  ]);
  const spriteRef = useRef<Sprite>(null);
  const materialRef = useRef<SpriteMaterial>(null);
  const keyboard = useKeyboard();

  const player = useRef<RenderCharacter>({
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
    player.current = { position, velocity, direction, state: characterState };
    // spriteRef.current.position.x = position[0] * 0.01;
    // spriteRef.current.position.y = position[1] * 0.01;
    spriteRef.current.translateX(velocity[0] * 0.01);
    spriteRef.current.translateY(velocity[1] * 0.01);
    // spriteRef.current.scale.setX(1);
  });
  // url.wrapS = MirroredRepeatWrapping;
  // url.repeat.set(1, 1);
  // url.offset.x = 0.5;
  const tileSize = [2, 1];
  const animator = createTileTextureAnimator(url, [418, 626]);
  animator(5);
  console.log("player render");

  return (
    <Suspense fallback={null}>
      <sprite ref={spriteRef}>
        <planeGeometry args={[418 / 626, 1]} />
        <spriteMaterial ref={materialRef} map={url} />
      </sprite>
    </Suspense>
  );
};
