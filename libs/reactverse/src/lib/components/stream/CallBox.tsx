import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";

import { Call } from "./Call";
export interface CallBoxProps {
  localStream: MediaStream;
  screenStream?: MediaStream;
  socket: Soc;
  roomId: string;
}

export const CallBox = ({ localStream, screenStream, socket, roomId }: CallBoxProps) => {
  const me = useWorld((state) => state.me);
  const peers = useGossip((state) => state.peers);
  const callRoom = useGossip((state) => state.callRoom);
  const addPeer = useGossip((state) => state.addPeer);

  useEffect(() => {
    socket.emit("join", { roomId, userId: me.userId, nickName: me.userId });
    socket.on("init", (initiator: boolean, inits: types.InitForm[]) =>
      inits.map((init) => addPeer(initiator, init, localStream, screenStream))
    );
    //   socket.on("full", () => setFull(true));
  }, []);

  return (
    <>
      {peers.map((peer, idx) => (
        <Call key={idx} peer={peer} socket={socket} />
      ))}
    </>
  );
};
