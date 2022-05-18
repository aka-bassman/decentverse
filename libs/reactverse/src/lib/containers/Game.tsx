import { useState, useEffect, Suspense, useRef } from "react";
import { useThree, Canvas } from "@react-three/fiber";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Game = ({ children }: any) => {
  return (
    <div style={{ width: 1000, height: 1000 }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 1000] }}>
        <Suspense fallback={null}>{children}</Suspense>
        {/* <ambientLight intensity={1} /> */}
      </Canvas>
    </div>
  );
};
