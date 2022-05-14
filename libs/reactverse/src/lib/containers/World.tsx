import { useState, useEffect } from "react";
import { Tiles, Sprite, Player } from "../components";
import { actions, select, useAppDispatch, useAppSelector } from "../stores";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const World = () => {
  const dispatch = useAppDispatch();
  const tiles = useAppSelector(select.renderTiles);
  useEffect(() => {
    console.log("world");
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <Tiles tiles={tiles} />
      {/* {render && <Sprite src={render.src} flip={render.flip} position={render.position} velocity={render.velocity} />} */}
      <Player />
    </div>
  );
};
