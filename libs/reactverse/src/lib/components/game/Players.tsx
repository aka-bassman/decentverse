import React, { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { types, useWorld, RenderCharacter, scalar, useGame } from "../../stores";
import { Sprite, SpriteMaterial } from "three";
import { useTexture, Text } from "@react-three/drei";
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
  const texture = useTexture(player.character.file.url);
  const animator = createTileTextureAnimator(texture, player.character.tileSize);
  const sprite = useRef<Sprite>(null);
  const animation = useRef<scalar.SpriteDef>(player.character.right.idle);
  const movement = useRef<{
    prev: types.RenderCharacter;
    next: types.RenderCharacter;
    live: types.RenderCharacter;
  } | null>(null);
  useEffect(() => {
    const subscription = (id: string, data: types.RenderCharacter) => {
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
      <planeGeometry args={[player.character.tileSize[0], player.character.tileSize[1]]} />
      <spriteMaterial map={texture} />
      <Text lineHeight={0.8} position={[0, 120, 1]} fontSize={60} material-toneMapped={false}>
        {player.id}
      </Text>
    </sprite>
  );
});
