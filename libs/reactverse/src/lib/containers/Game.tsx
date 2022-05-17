import { useState, useEffect, Suspense } from "react";
import { useThree, Canvas } from "@react-three/fiber";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Game = ({ children }: any) => {
  return (
    <div style={{ width: 1000, height: 1000 }}>
      <Canvas>
        <Suspense fallback={null}>{children}</Suspense>
        {/* <ambientLight intensity={1} /> */}
      </Canvas>
    </div>
  );
};
