import React, { useState, useEffect } from "react";
import { useWorld } from "../stores";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return [width, height];
};

export const useWindowDimensions = () => {
  const screen = useWorld((state) => state.screen);
  const changeScreenSize = useWorld((state) => state.changeScreenSize);
  useEffect(() => {
    const handleResize = () => changeScreenSize({ size: getWindowDimensions(), offset: [0, 0] });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screen.size;
};
