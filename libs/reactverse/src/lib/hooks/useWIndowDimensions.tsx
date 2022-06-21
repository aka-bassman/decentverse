import React, { useState, useEffect } from "react";
import { useGame, useWorld } from "../stores";

const getWindowDimensions = () => {
  const { outerWidth: width, outerHeight: height } = window;
  console.log(window.outerWidth);
  console.log(window.outerHeight);
  return [width, height];
};

export const useWindowDimensions = () => {
  const screen = useGame((state) => state.screen);
  const changeScreenSize = useGame((state) => state.changeScreenSize);
  useEffect(() => {
    console.log("getWindowDimensionsS", getWindowDimensions());
    const handleResize = () => changeScreenSize({ size: getWindowDimensions(), offset: [0, 0] });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screen.size;
};
