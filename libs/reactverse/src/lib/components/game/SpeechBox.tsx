import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { types, useWorld, useUser, RenderCharacter, scalar, useGame, world, useGossip } from "../../stores";
import { Sprite, SpriteMaterial, Renderer } from "three";
import { useTexture, Text } from "@react-three/drei";
import { useDuration, createTileTextureAnimator, useInterval } from "../../hooks";
import { Engine, World, Bodies, Vector, Body } from "matter-js";
import { TextureLoader } from "three";

export const SpeechBox = () => {
  const isTalk = useGossip((state) => state.callRoom.isTalk);
  const speechBubble = useTexture("./speechBubble.png");

  return (
    <sprite position={[0, 220, 1]}>
      <planeGeometry args={isTalk ? [120, 125] : [0, 0]} />
      {<spriteMaterial map={speechBubble} />}
    </sprite>
  );
};
