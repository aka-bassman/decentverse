import React, { Suspense, useRef, MutableRefObject, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { types, scalar, useWorld, RenderCharacter, useGame } from "../../stores";
import { Group, Scene, Sprite, SpriteMaterial, Vector, Vector3, TextureLoader, MeshBasicMaterial } from "three";
import { useTexture, Text, Html } from "@react-three/drei";
import { useInterval } from "../../hooks";
import { makeScope } from "../../utils";
import { Tile } from "./Tile";
import { InteractionIcon } from "..";
import { Bodies, Engine, World } from "matter-js";
import { isMobile } from "react-device-detect";

export interface WebviewsProp {
  engine: MutableRefObject<Engine>;
  interaction: MutableRefObject<types.InteractionState>;
  player: MutableRefObject<types.RenderCharacter>;
  keyboard: MutableRefObject<scalar.Keyboard>;
}
export const Webviews = ({ engine, interaction, player, keyboard }: WebviewsProp) => {
  const webviews = useWorld((state) => state.map?.webviews);
  const closeWebview = useWorld((state) => state.closeWebview);
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
      if (interaction.current.webview === null) return;
      console.log("webview leave interval");
      interaction.current.webview = null;

      // leaveInteraction("webview");
      closeWebview();
    } else {
      webviews?.map((webview) => {
        if (
          webview.topLeft[0] < player.current.position[0] &&
          player.current.position[0] < webview.bottomRight[0] &&
          webview.topLeft[1] > player.current.position[1] &&
          player.current.position[1] > webview.bottomRight[1]
        ) {
          interaction.current.webview = webview;
          // joinInteraction("webview", webview);
        }
      });
    }
  }, 500);
  return (
    <Suspense fallback={null}>
      {webviews?.map((webview, idx) => (
        <Webview key={idx} webview={webview} interaction={interaction} />
      ))}
    </Suspense>
  );
};

export interface WebviewProp {
  webview: scalar.Webview;
  interaction: MutableRefObject<types.InteractionState>;
}
export const Webview = React.memo(({ webview, interaction }: WebviewProp) => {
  // const interaction = useWorld((state) => state.interaction);
  const openWebview = useWorld((state) => state.openWebview);
  const isOpen = useWorld((state) => state.isWebviewOpen);
  const keyboardInteraction = useGame((state) => state.keyboard.interaction);
  const position = new Vector3(
    (webview.bottomRight[0] + webview.topLeft[0]) / 2,
    (webview.bottomRight[1] + webview.topLeft[1]) / 2,
    -0.00000005
  );

  useInterval(() => {
    if (keyboardInteraction && interaction.current.webview) openWebview();
  }, 100);
  const [width, height] = [webview.topLeft[0] - webview.bottomRight[0], webview.bottomRight[1] - webview.topLeft[1]];

  return (
    <Suspense fallback={null}>
      <mesh position={position}>
        {/* <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={0xff0000} transparent /> */}
        {interaction && interaction.current.webview?.url === webview.url && !isOpen && (
          <>
            {isMobile ? (
              <Html
                center
                style={{
                  backgroundColor: `rgba(0,0,0,${0.7})`,
                  color: "white",
                  borderRadius: 10,
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.2em",
                }}
              >
                <div style={{ display: "block", marginRight: 10 }}>Press</div>
                <InteractionIcon />
              </Html>
            ) : (
              <Html
                center
                style={{
                  backgroundColor: `rgba(0,0,0,${0.7})`,
                  color: "white",
                  width: "max-content",
                  borderRadius: 10,
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  wordWrap: "normal",
                  fontSize: "1.2em",
                }}
              >
                Press 'F'
              </Html>
            )}
          </>
        )}
      </mesh>
    </Suspense>
  );
});
