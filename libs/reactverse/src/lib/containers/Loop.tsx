import { useState, useEffect } from "react";
import { useInterval } from "../hooks";
import { actions, select, useAppDispatch, useAppSelector } from "../stores";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const Loop = ({ children }: { children: any }) => {
  const keyboard = useAppSelector(select.keyboard);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("loop");
  }, []);
  // useInterval(() => {
  //   dispatch(actions.accelMe(keyboard));
  //   dispatch(actions.moveMe());
  // }, 16);
  return <div>Loop Provider{children}</div>;
};
