import { useState, useEffect } from "react";
import { Tiles, Player } from "../components";
import { actions, select, useAppDispatch, useAppSelector } from "../stores";

// 게임 루프를 관리함. 렉 발생 시 핸들링 처리
export const World = () => {
  const dispatch = useAppDispatch();
  const tiles = useAppSelector(select.renderTiles);
  const me = useAppSelector(select.me);
  useEffect(() => {
    console.log("world");
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <Tiles tiles={tiles} />
      <div style={{ position: "absolute", top: 0, left: 0 }}>{me && <Player player={me} />}</div>
    </div>
  );
};
