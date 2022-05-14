import { useEffect, useRef, useState } from "react";
import * as scalar from "../../stores/scalar.type";
import * as types from "../../stores/types";
import { useInterval } from "../../hooks";

export interface SpriteProps {
  src: string;
  flip: boolean;
  position: number[];
  velocity: number[];
}
export const Sprite = ({ src, flip, position, velocity }: SpriteProps) => {
  // const [trail, api] = useTrail(1, (i) => ({
  //   xy: [0, 0],
  //   config: slow,
  // }));
  // // const [ref, { left, top }] = useMeasure()

  // api.start({ xy: position });
  // const styles = useSpring({
  //   to: { x: position[0], y: position[1], config: { mass: 10, tension: 200, friction: 20 } },
  // });
  const pos = useRef(position);
  // useInterval(() => {
  //   pos.current = [
  //     pos.current[0] + Math.floor(position[0] - pos.current[0]),
  //     pos.current[1] + Math.floor(position[1] - pos.current[1]),
  //   ];
  // }, 16);
  return (
    <img
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${position[0]}px, ${position[1]}px)`,
      }}
      src={src}
      alt=""
    />
  );
};
