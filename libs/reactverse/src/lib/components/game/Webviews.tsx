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
  interaction: MutableRefObject<types.InteractionState>;
  player: MutableRefObject<types.RenderCharacter>;
}
export const Webviews = ({ engine, interaction, player }: WebviewsProp) => {
  const webviews = useWorld((state) => state.map?.webviews);
  const joinInteraction = useWorld((state) => state.joinInteraction);
  const leaveInteraction = useWorld((state) => state.leaveInteraction);
  useInterval(() => {
    if (interaction.current.webview) {
      if (
        interaction.current.webview.topLeft[0] < player.current.position[0] &&
        player.current.position[0] < interaction.current.webview.bottomRight[0] &&
        interaction.current.webview.topLeft[1] > player.current.position[1] &&
        player.current.position[1] > interaction.current.webview.bottomRight[1]
      )
        return;
      console.log("leave web view");
      interaction.current.webview = null;
      leaveInteraction("webview");
    } else {
      webviews?.map((webview) => {
        if (
          webview.topLeft[0] < player.current.position[0] &&
          player.current.position[0] < webview.bottomRight[0] &&
          webview.topLeft[1] > player.current.position[1] &&
          player.current.position[1] > webview.bottomRight[1]
        ) {
          console.log("join web view");
          interaction.current.webview = webview;
          joinInteraction("webview", webview);
        }
      });
    }
  }, 500);
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
export const Webview = React.memo(({ webview }: WebviewProp) => {
  const position = new Vector3(
    (webview.bottomRight[0] + webview.topLeft[0]) / 2,
    (webview.bottomRight[1] + webview.topLeft[1]) / 2,
    -0.00000005
  );
  const [width, height] = [webview.topLeft[0] - webview.bottomRight[0], webview.bottomRight[1] - webview.topLeft[1]];

  return (
    <Suspense fallback={null}>
      <mesh position={position}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0xff0000} transparent />
      </mesh>
    </Suspense>
  );
});
