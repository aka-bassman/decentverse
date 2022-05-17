import { useState, useEffect } from "react";
import { useThree, Canvas } from "@react-three/fiber";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Character = ({ children }: any) => {
  const get = useThree((state) => state.get);
  const set = useThree((state) => state.set);

  <Canvas>
    <mesh>{children}</mesh>
  </Canvas>;
};
