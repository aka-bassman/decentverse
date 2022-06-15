import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { Bodies, Engine, World } from "matter-js";
import { reactDomVersion } from "@nrwl/react";

export interface WebViewProp {
  webView: scalar.Interaction;
  engine: MutableRefObject<Engine>;
}
export const WebView = React.memo(({ webView, engine }: WebViewProp) => {
  const me = useWorld((state) => state.me);
  const position = new Vector3(
    (webView.bottomRight[0] + webView.topLeft[0]) / 2,
    (webView.bottomRight[1] + webView.topLeft[1]) / 2,
    -0.00000005
  );
  const [width, height] = [webView.topLeft[0] - webView.bottomRight[0], webView.bottomRight[1] - webView.topLeft[1]];
  useEffect(() => {
    const box = Bodies.rectangle(position.x, position.y, width, height, { isStatic: true });
    World.add(engine.current.world, box);

    return () => {
      World.remove(engine.current.world, box);
    };
  }, []);
  useEffect(() => {
    console.log("join area?", me.render.position);
    if (Math.abs(me.render.position[0] - position.x) > 10 || Math.abs(me.render.position[1] - position.y) > 10)
      console.log("join area");
  }, [me.render.position]);

  return (
    <Suspense fallback={null}>
      {/* <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0xff0000} transparent />
      </mesh> */}
    </Suspense>
  );
});
