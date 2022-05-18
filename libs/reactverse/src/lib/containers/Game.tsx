import { Suspense, useRef, MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useWorld, RenderCharacter, scalar } from "../stores";
import { Sprite, SpriteMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useKeyboard, useDuration, createTileTextureAnimator } from "../hooks";
import { Map, Player } from "./index";
// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Game = () => {
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>({ row: 0, column: 1, duration: 1000 });
  const keyboard = useKeyboard();
  const player = useRef<RenderCharacter>({
    position: [0, 0],
    velocity: [0, 0],
    state: "idle",
    direction: "right",
  });
  return (
    <Suspense fallback={null}>
      <Map />
      <Player sprite={sprite} animation={animation} keyboard={keyboard} player={player} />
    </Suspense>
  );
};
