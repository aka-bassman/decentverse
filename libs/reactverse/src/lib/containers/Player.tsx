import { useState, useEffect, Suspense, useRef } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { useWorld, RenderCharacter, scalar } from "../stores";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Material, Sprite, SpriteMaterial, MirroredRepeatWrapping, RepeatWrapping } from "three";
import { useTexture, Html, useProgress } from "@react-three/drei";
import { useKeyboard, useDuration, useInterval } from "../hooks";

export function tiledToR3FTextureTranspiler(
  tilePosition: number[],
  tilesAmountX: number,
  tilesAmountY: number
  // tileSize: number[]
) {
  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  // const tilesAmountX = imageWidth / tileSize[0];
  // const tilesAmountY = imageHeight / tileSize[1];

  return {
    // repeat: { x: 1 / tilesAmountX, y: 1 / tilesAmountY },
    offset: {
      x: tilePosition[1] / tilesAmountY,
      y: (tilesAmountX - tilePosition[0] - 1) / tilesAmountX,
    },
  };
}

export function createTileTextureAnimator(texture: THREE.Texture, tileSize: number[], startValue = 0) {
  texture.wrapS = texture.wrapT = RepeatWrapping;

  // image width and height size (e.g 512px) / tile width and height size (e.g. 32px)
  const tilesAmountX = texture.image.width / tileSize[0];
  const tilesAmountY = texture.image.height / tileSize[1];

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionX = Math.floor(startValue % tilesAmountX);

  // X coordinate position of the texture based on the tilesetValue for this tile
  const texturePositionY = -1 + tilesAmountY - Math.floor(startValue / tilesAmountX);

  texture.repeat.set(1 / tilesAmountX, 1 / tilesAmountY);

  texture.offset.x = texturePositionX / tilesAmountX;
  texture.offset.y = texturePositionY / tilesAmountY;

  return (tilePosition: number[]) => {
    const { offset } = tiledToR3FTextureTranspiler(
      tilePosition,
      tilesAmountX,
      tilesAmountY
      // texture.image.width, texture.image.height , tileSize
    );
    texture.offset.x = offset.x;
    texture.offset.y = offset.y;
  };
}

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Player = ({ children }: any) => {
  const { camera, set } = useThree();
  useFrame(() => {
    camera.position.setX(camera.position.x + 1);
    // set({ camera: { ...camera, position: [camera.position[0] + 1, camera.position[1], 1000] } });
  });
  const me = useWorld((state) => state.me);
  const [url] = useTexture([
    "/sprite.png",
    // "https://media.discordapp.net/attachments/975326008951578674/976139286518825010/akacity.jpg?width=1551&height=1357",
  ]);
  const spriteRef = useRef<Sprite>(null);
  const materialRef = useRef<SpriteMaterial>(null);
  const animationRef = useRef<scalar.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const keyboard = useKeyboard();
  const interval = useRef(500);
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
      : player.current.direction;
    player.current = { position, velocity, direction, state: characterState };
    spriteRef.current.translateX(velocity[0]);
    spriteRef.current.translateY(velocity[1]);
    const character = me.character as any;
    animationRef.current = character[player.current.direction][player.current.state];
    if (direction === "up") interval.current = 100;
  });
  const animator = createTileTextureAnimator(url, [418, 626]);
  useDuration((p) => {
    animator([animationRef.current.row, p]);
  }, animationRef);
  useInterval(() => {
    console.log(spriteRef.current?.position.x);
  }, interval.current);
  console.log("player render");

  return (
    <Suspense fallback={null}>
      <sprite ref={spriteRef}>
        <planeGeometry args={[418, 626]} />
        <spriteMaterial ref={materialRef} map={url} />
      </sprite>
    </Suspense>
  );
};
