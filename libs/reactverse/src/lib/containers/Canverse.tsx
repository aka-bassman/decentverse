import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { ImageLoader } from "three/src/loaders/ImageLoader";

// export interface ReactverseProps {
//   a: any;
// }

export const Box = ({ props }: any) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef({ rotation: { x: 0, y: 0 } });
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  useFrame((state, delta, xFrame) => {
    console.log(state, delta, xFrame);
  });

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const Tile = ({ props }: any) => {
  const colorMap = useLoader(TextureLoader, "s3/azure-sky.png");
  return (
    <mesh {...props}>
      <planeBufferGeometry attach="geometry" args={[15, 15]} />
      <meshStandardMaterial attach="material" map={colorMap} color="#e0e0e0" />
    </mesh>
  );
};

const Character = ({ props }: any) => {
  const [idle, walk] = useLoader(TextureLoader, ["s3/f_idle.gif", "s3/f_walk.gif"]);
  return (
    <sprite {...props} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1]} />
      <spriteMaterial map={idle} />
    </sprite>
  );
};

export const Canverse = () => {
  return (
    <div style={{ width: 1000, height: 1000 }}>
      <Canvas
        camera={{
          position: [0, 0, 1],
          zoom: 0.1,
        }}
        gl={{ alpha: false, antialias: false }}
      >
        <ambientLight intensity={1} />
        {/* <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} /> */}
        {/* <pointLight position={[-10, -10, -10]} /> */}
        {/* <Box /> */}
        <Tile />
        <Character />
      </Canvas>
    </div>
  );
};
