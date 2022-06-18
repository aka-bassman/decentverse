import React, { Suspense } from "react";
import { useWorld } from "../../stores";
import { Vector3 } from "three";

export const Overlay = () => {
  const interaction = useWorld((state) => state.interaction);

  if (!interaction.callRoom) return null;
  const width = interaction.callRoom.bottomRight[0] - interaction.callRoom.topLeft[0];
  const height = interaction.callRoom.topLeft[1] - interaction.callRoom.bottomRight[1];
  const offset = 10000;

  const positions = [
    {
      position: new Vector3(
        (interaction.callRoom.bottomRight[0] + interaction.callRoom.bottomRight[0] + offset) / 2,
        (interaction.callRoom.bottomRight[1] + interaction.callRoom.topLeft[1]) / 2,
        3
      ),
      width: offset,
      height: offset,
    },
    {
      position: new Vector3(
        (interaction.callRoom.topLeft[0] + (interaction.callRoom.topLeft[0] - offset)) / 2,
        (interaction.callRoom.bottomRight[1] + interaction.callRoom.topLeft[1]) / 2,
        3
      ),
      width: offset,
      height: offset,
    },
    {
      position: new Vector3(
        (interaction.callRoom.bottomRight[0] + interaction.callRoom.topLeft[0]) / 2,
        (offset + interaction.callRoom.topLeft[1] + interaction.callRoom.topLeft[1]) / 2,
        3
      ),
      width: width,
      height: offset,
    },
    {
      position: new Vector3(
        (interaction.callRoom.bottomRight[0] + interaction.callRoom.topLeft[0]) / 2,
        (interaction.callRoom.bottomRight[1] + (interaction.callRoom.bottomRight[1] - offset)) / 2,
        3
      ),
      width: width,
      height: offset,
    },
  ];

  return (
    <Suspense fallback={null}>
      <ambientLight />
      {positions.map((cur, index) => (
        <mesh position={cur.position} key={index}>
          <planeBufferGeometry attach="geometry" args={[cur.width, cur.height]} />
          <meshPhongMaterial attach="material" color={0x000000} opacity={0.4} transparent={true} />
        </mesh>
      ))}
    </Suspense>
  );
};
