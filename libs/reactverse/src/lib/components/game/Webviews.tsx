import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { Bodies, Engine, World } from "matter-js";
export interface WebviewsProp {
  engine: MutableRefObject<Engine>;
}
export const Webviews = ({ engine }: WebviewsProp) => {
  const webviews = useWorld((state) => state.map?.webviews);
  return (
    <Suspense fallback={null}>
      {webviews?.map((webview, idx) => (
        <Webview key={idx} webview={webview} engine={engine} />
      ))}
    </Suspense>
  );
};

export interface WebviewProp {
  webview: scalar.Interaction;
  engine: MutableRefObject<Engine>;
}
export const Webview = React.memo(({ webview, engine }: WebviewProp) => {
  const position = new Vector3(
    (webview.bottomRight[0] + webview.topLeft[0]) / 2,
    (webview.bottomRight[1] + webview.topLeft[1]) / 2,
    -0.00000005
  );
  const [width, height] = [webview.topLeft[0] - webview.bottomRight[0], webview.bottomRight[1] - webview.topLeft[1]];
  useEffect(() => {
    const box = Bodies.rectangle(position.x, position.y, width, height, { isStatic: true });
    World.add(engine.current.world, box);
    return () => {
      World.remove(engine.current.world, box);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      {/* <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0xff0000} transparent />
      </mesh> */}
    </Suspense>
  );
});
