import React, { Suspense, useRef, MutableRefObject, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar, useGame } from "../../stores";
import { Sprite, SpriteMaterial } from "three";
import { useTexture, Text, Html } from "@react-three/drei";
import { useDuration, createTileTextureAnimator, useInterval } from "../../hooks";
import PubSub from "pubsub-js";

export interface PlayersProp {
  playerId: string;
}

export const Players = ({ playerId }: PlayersProp) => {
  const otherPlayerIds = useWorld((state) => state.otherPlayerIds);
  const otherPlayers = useWorld((state) => state.otherPlayers);
  return (
    <Suspense fallback={null}>
      {otherPlayerIds.map((id) => {
        const otherPlayer = otherPlayers.get(id);
        return otherPlayer && otherPlayer.id !== playerId ? (
          <OtherPlayer key={otherPlayer.id} player={otherPlayer} />
        ) : null;
      })}
    </Suspense>
  );
};

export interface OtherPlayerProp {
  player: types.OtherPlayer;
}
export const OtherPlayer = React.memo(({ player }: OtherPlayerProp) => {
  const texture = useTexture(`ayias/decentverse/character/chinchin.png?id=${player.id}`);
  const animator = createTileTextureAnimator(texture, player.character.tileSize);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>(player.character.right.idle);
  const movement = useRef<{
    prev: types.RenderOtherPlayer;
    next: types.RenderOtherPlayer;
    live: types.RenderOtherPlayer;
  } | null>(null);
  useEffect(() => {
    const subscription = (id: string, data: types.RenderOtherPlayer) => {
      if (!sprite.current) return;
      animation.current = (player.character as any)[data.direction][data.state];
      if (!movement.current) {
        movement.current = { prev: data, next: data, live: data };
        sprite.current.position.set(data.position[0], data.position[1], 0);
      } else
        movement.current = {
          prev: movement.current.next,
          next: data,
          live: {
            ...data,
            position: movement.current.live.position,
            velocity: [
              ((data.position[0] - movement.current.live.position[0]) * 16.66) / 250,
              ((data.position[1] - movement.current.live.position[1]) * 16.66) / 250,
            ],
          },
        };
      if (data.chatText !== movement.current.prev.chatText) PubSub.publish(`chat:${player.id}`, data.chatText);
    };
    PubSub.subscribe(player.id, subscription);
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);
  useFrame(() => {
    if (!sprite.current || !movement.current) return;
    movement.current.live.position = [
      movement.current.live.position[0] + movement.current.live.velocity[0],
      movement.current.live.position[1] + movement.current.live.velocity[1],
    ];
    sprite.current.position.set(movement.current.live.position[0], movement.current.live.position[1], 0);
  });
  useDuration((p) => {
    animator([animation.current.row, p]);
  }, animation);
  return (
    <sprite ref={sprite}>
      <planeGeometry args={[120, 165]} />
      <spriteMaterial map={texture} />
      <Text lineHeight={0.8} position={[0, -120, 1]} fontSize={60} material-toneMapped={false}>
        {player.id}
      </Text>
      <PlayerChat id={player.id} />
    </sprite>
  );
});
export const PlayerChat = ({ id }: { id: string }) => {
  const [chatText, setChatText] = useState("");
  useEffect(() => {
    const subscription = (_: string, text: string) => {
      setChatText(text);
    };
    PubSub.subscribe(`chat:${id}`, subscription);
    return () => {
      PubSub.unsubscribe(subscription);
    };
  }, []);
  return (
    <Html
      center
      style={{
        backgroundColor: `rgba(255,255,255,${chatText.length ? 0.7 : 0})`,
        maxWidth: 300,
        width: "max-content",
        borderRadius: 10,
        bottom: 35,
        padding: 10,
        alignContent: "center",
        alignItems: "center",
        wordWrap: "normal",
      }}
    >
      {chatText}
    </Html>
  );
};
