import React, { useState, useEffect } from "react";
import { actions, select, useAppDispatch, useAppSelector } from "../stores";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return [width, height];
};

export const useWindowDimensions = () => {
  const dispatch = useAppDispatch();
  const screen = useAppSelector(select.screen);
  useEffect(() => {
    const handleResize = () => dispatch(actions.changeScreenSize({ size: getWindowDimensions(), offset: [0, 0] }));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return screen.size;
};
