import { useRef, useReducer, useState, useEffect } from "react";
import { Stage, Sprite, useTick, AppProvider, useApp, AppContext, AnimatedSprite } from "@inlet/react-pixi";
import * as scalar from "../../stores/scalar.type";
import * as types from "../../stores/types";
import { ReactReduxContext } from "react-redux";
import * as PIXI from "pixi.js";

const ContextBridge = ({ children, Context, render }: any) => {
  return (
    <Context.Consumer>
      {(value: any) => render(<Context.Provider value={value}>{children}</Context.Provider>)}
    </Context.Consumer>
  );
};
export const PixiStage = ({ children, ...props }: any) => {
  return (
    <ContextBridge Context={ReactReduxContext} render={(children: any) => <Stage {...props}>{children}</Stage>}>
      {children}
    </ContextBridge>
  );
};

export const PixiTest = () => {
  const [motion, update] = useState({ x: 100, y: 100, rotation: 0, anchor: 0 });
  const ref = useRef({ x: 100, y: 100, rotation: 0, anchor: 0 });
  const iter = useRef(0);
  const app = useApp();
  useEffect(() => {
    app.start();
    return () => app.destroy();
  }, []);
  useTick((delta) => {
    const i = (iter.current += 0.05 * delta);
    // update({
    //   x: Math.sin(i) * 100,
    //   y: Math.sin(i / 1.5) * 100,
    //   rotation: Math.sin(i) * Math.PI,
    //   anchor: Math.sin(i / 2),
    // });
    ref.current = {
      x: Math.sin(i) * 100,
      y: Math.sin(i / 1.5) * 100,
      rotation: Math.sin(i) * Math.PI,
      anchor: Math.sin(i / 2),
    };
  });
  return (
    <Stage>
      <Sprite
        image="https://lh3.googleusercontent.com/xSL_DXmyx82H2eQ5TOuxFIDRW6FJkFc_-V8n6Ig5dNoV-GMtJ0-OLznIc717722p8H3ZVRi-am2_jEd7BZSZdJC1d86qChgOiXqEgQ=w292"
        {...ref}
      />
    </Stage>
  );
};
