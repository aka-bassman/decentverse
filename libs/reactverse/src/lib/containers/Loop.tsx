import { useState, useEffect } from "react";
import { useInterval } from "../hooks";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Loop = ({ children }: { children: any }) => {
  useEffect(() => {
    console.log("loop");
  }, []);
  return <div>Loop Provider{children}</div>;
};
