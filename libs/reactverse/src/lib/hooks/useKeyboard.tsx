import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useGame } from "../stores";
import { scalar } from "../stores";
import { useInterval } from "./useInterval";
import { isMobile } from "react-device-detect";

export interface KeyboardProps {
  keyState: MutableRefObject<scalar.Keyboard>;
  lockState: MutableRefObject<boolean>;
}

export const useKeyboard = ({ keyState, lockState }: KeyboardProps) => {
  const keyboard = useGame((state) => state.keyboard);
  const keyLock = useGame((state) => state.keyLock);
  const setKey = useGame((state) => state.setKey);
  const lockKey = useGame((state) => state.lockKey);
  useEffect(() => {
    window.addEventListener("focus", () => lockKey(false));
    window.addEventListener("blur", () => lockKey(true));
    const handleKeyEvent = (event: any, state: boolean) => {
      if (event.repeat || lockState.current) return;
      const code: scalar.Key = event.code;
      const key = scalar.keyMap[code];
      if (!key) return;
      if (isMobile && key !== "interaction") return;
      else if (keyState.current[key] === state) return;
      keyState.current[key] = state;
      setKey(key, state);
    };
    const handleKeyDown = (event: any) => handleKeyEvent(event, true);
    const handleKeyUp = (event: any) => handleKeyEvent(event, false);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      // if (!isMobile) {
      // };
    };
  }, []);
  useEffect(() => {
    keyState.current = keyboard;
  }, [keyboard]);
  useEffect(() => {
    lockState.current = keyLock;
    // if (keyLock) keyState.current = scalar.keyboard;
  }, [keyLock]);
};
