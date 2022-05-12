import React, { useEffect, useRef, useState } from "react";
import { actions, select, useAppDispatch, useAppSelector } from "../stores";

const keyMap = {
  KeyW: "up",
  KeyA: "left",
  KeyS: "down",
  KeyD: "right",
  ArrowUp: "up",
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowRight: "right",
} as const;
type Key = keyof typeof keyMap;
export const useKeyboard = () => {
  const dispatch = useAppDispatch();
  const keyState = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  });
  useEffect(() => {
    const handleKeyEvent = (event: any, state: boolean) => {
      if (event.repeat) return;
      const code: Key = event.code;
      const key = keyMap[code];
      if (!key) return;
      else if (keyState.current[key] === state) return;
      keyState.current[key] = state;
      dispatch(actions.setKey({ key, state }));
    };
    const handleKeyDown = (event: any) => handleKeyEvent(event, true);
    const handleKeyUp = (event: any) => handleKeyEvent(event, false);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
};
