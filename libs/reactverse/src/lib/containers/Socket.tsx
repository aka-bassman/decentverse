import { useState, useEffect, MutableRefObject } from "react";
import { io, Socket as Soc } from "socket.io-client";
import { useInterval } from "../hooks/useInterval";
import { defaultCharacter, types, useWorld } from "../stores";
import { encodeProtocolV1, decodeProtocolV1, makeCharacterMessage } from "../utils";
import PubSub from "pubsub-js";

export interface SocketProp {
  uri: string;
  player: MutableRefObject<types.RenderCharacter>;
  scope: MutableRefObject<types.WorldScope>;
}

// 소켓 데이터 처리를 주로 진행
export const Socket = ({ uri, player, scope }: SocketProp) => {
  const addOtherPlayers = useWorld((state) => state.addOtherPlayers);
  const setOtherPlayerIds = useWorld((state) => state.setOtherPlayerIds);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc | null>(null);
  const me = useWorld((state) => state.me);
  useEffect(() => {
    const socket = io(uri);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
    socket.emit("register", player.current.id, makeCharacterMessage(me.character));
    socket.on("players", (data) => {
      const players = data.map((dat: string) => decodeProtocolV1(dat));
      const ids = players.map((player: types.RenderCharacter) => {
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
          const character: types.Character = JSON.parse(data);
          return { id, character, updatedAt: now };
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
    socket.emit("player", ...encodeProtocolV1(player.current, scope.current));
  }, 250);

  return isConnected ? <div>connected</div> : <div>Connecting Socket...</div>;
};
