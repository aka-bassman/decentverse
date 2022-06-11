import React, { useEffect, useRef, useState } from "react";
import { useGame } from "../stores";
import { scalar } from "../stores";

export const useKeyboard = () => {
  const keyboard = useGame((state) => state.keyboard);
  const setKey = useGame((state) => state.setKey);
  const keyState = useRef(scalar.keyboard);
  useEffect(() => {
    const handleKeyEvent = (event: any, state: boolean) => {
      if (event.repeat) return;
      const code: scalar.Key = event.code;
      const key = scalar.keyMap[code];
      if (!key) return;
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
    };
  }, []);
  useEffect(() => {
    keyState.current = keyboard;
  }, [keyboard]);
  return keyState;
};
