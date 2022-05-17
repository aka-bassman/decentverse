import { useEffect, useRef, useState } from "react";
import { useInterval } from "../../hooks";
import * as scalar from "../../stores/scalar.type";
import * as types from "../../stores/types";
import { useGame, useWorld } from "../../stores";

// export interface PlayerProps {
//   // player: types.Player;
// }

export const Player = () => {
  const keyboard = useGame((state) => state.keyboard);
  const me = useWorld((state) => state.me);
  const accelMe = useWorld((state) => state.accelMe);
  // const position = useRef<number[]>(player.render.position);
  const x = useRef<number>(0);
  useInterval(() => {
    accelMe(keyboard);
  }, 15);
  return me ? (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${me.render.position[0]}px, ${me.render.position[1]}px) scaleX(${
          me.render.flip ? -1 : 1
        })`,
      }}
    >
      <img width={200} height={200} src={me.render.src} alt="" />
    </div>
  ) : (
    <div />
  );
};
