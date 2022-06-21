import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
import { PeoplesIcon } from "..";
import { Call } from "./Call";
import styled from "styled-components";

export interface CallBoxProps {
  localStream: MediaStream;
  screenStream?: MediaStream;
  socket: Soc;
  roomId: string;
}

export const CallBox = ({ localStream, screenStream, socket, roomId }: CallBoxProps) => {
  const me = useWorld((state) => state.me);
  const peers = useGossip((state) => state.peers);
  const addPeer = useGossip((state) => state.addPeer);

  useEffect(() => {
    socket.on("init", (clientId: string, init: types.InitForm) => {
      if (init.userId === me.userId) return;
      addPeer(clientId, false, init, localStream, screenStream);
      socket.emit("receive", { socketId: clientId, roomId, userId: me.userId, nickName: me.userId });
    });
    socket.on("receive", (clientId: string, init: types.InitForm) => {
      addPeer(clientId, true, init, localStream, screenStream);
    });
    return () => {
      socket.off("init");
      socket.off("receive");
    };
    // socket.on("full", () => setFull(true));
  }, []);

  return (
    <CallBoxContainer>
      {peers.map((peer, idx) => (
        <Call key={peer.id} peer={peer} socket={socket} />
      ))}
    </CallBoxContainer>
  );
};

const CallBoxContainer = styled.div`
  /* overflow-y: scroll; */
`;
