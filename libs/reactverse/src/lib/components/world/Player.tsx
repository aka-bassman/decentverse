import { useEffect, useRef, useState } from "react";
import { useInterval } from "../../hooks";
import * as scalar from "../../stores/scalar.type";
import * as types from "../../stores/types";
import { actions, select, useAppDispatch, useAppSelector } from "../../stores";

// export interface PlayerProps {
//   // player: types.Player;
// }

export const Player = () => {
  const keyboard = useAppSelector(select.keyboard);
  const render = useAppSelector(select.meRender);
  const dispatch = useAppDispatch();
  // const position = useRef<number[]>(player.render.position);
  const x = useRef<number>(0);
  useInterval(() => {
    dispatch(actions.accelMe(keyboard));
  }, 15);
  return render ? (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${render.position[0]}px, ${render.position[1]}px) scaleX(${render.flip ? -1 : 1})`,
      }}
    >
      <img src={render.src} alt="" />
    </div>
  ) : (
    <div />
  );
};
