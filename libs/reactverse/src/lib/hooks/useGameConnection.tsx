import { useState, useEffect, MutableRefObject } from "react";
import { io, Socket as Soc } from "socket.io-client";
import { useInterval } from "../hooks/useInterval";
import { defaultCharacter, types, useGossip, useUser, useWorld } from "../stores";
import { encodeProtocolV1, decodeProtocolV1, makeCharacterMessage } from "../utils";
import PubSub from "pubsub-js";

export interface SocketProp {
  player: MutableRefObject<types.RenderCharacter>;
  scope: MutableRefObject<types.WorldScope>;
  socket: Soc;
}

// 소켓 데이터 처리를 주로 진행
export const useGameConnection = ({ player, scope, socket }: SocketProp) => {
  const user = useWorld((state) => state.me);
  const addOtherPlayers = useWorld((state) => state.addOtherPlayers);
  const setOtherPlayerIds = useWorld((state) => state.setOtherPlayerIds);
  const character = useWorld((state) => state.me.character);
  const myChat = useWorld((state) => state.myChat);
  const isTalk = useGossip((state) => state.callRoom.isTalk);
  useEffect(() => {
    socket.emit("register", user.id, makeCharacterMessage(user, character));
    window.addEventListener("focus", () => socket.emit("register", user.id, makeCharacterMessage(user, character)));
    socket.on("players", (data) => {
      const players = data.map((dat: string) => dat && decodeProtocolV1(dat)).filter((d: any) => !!d);
      const ids = players.map((player: types.RenderOtherPlayer) => {
        PubSub.publish(player.id, player);
        return player.id;
      });
      if (ids.length) socket.emit("characters", ids);
      setOtherPlayerIds(ids);
    });
    socket.on("characters", (ids, datas) => {
      const now = new Date().getTime();
      const otherPlayers = datas
        .map((data: string, idx: number) => {
          if (!data) return null;
          const id = ids[idx];
          const { user, character }: { user: types.User; character: types.Character } = JSON.parse(data);
          return { id, user, character, updatedAt: now };
        })
        .filter((player: types.OtherPlayer) => !!player?.character);
      if (otherPlayers.length) addOtherPlayers(otherPlayers);
    });
    return () => {
      socket.close();
    };
  }, []);
  useInterval(() => {
    if (!socket) return;
    const data = encodeProtocolV1({ ...player.current, id: user.id, chatText: myChat, isTalk }, scope.current);
    socket.emit("player", ...data);
  }, 250);
};
