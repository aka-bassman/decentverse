import { useEffect, useRef, useState } from "react";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
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
    socket.emit("join", { roomId, userId: me.userId, nickName: me.userId });
    socket.on("init", (clientId: string, initiator: boolean, init: types.InitForm) => {
      if (init.userId === me.userId) return;
      console.log("INIT");
      addPeer(clientId, initiator, init, localStream, screenStream);
      socket.emit("receive", { socketId: clientId, roomId, userId: me.userId, nickName: me.userId });
    });
    socket.on("receive", (clientId: string, initiator: boolean, init: types.InitForm) => {
      addPeer(clientId, initiator, init, localStream, screenStream);
    });

    //   socket.on("full", () => setFull(true));
  }, []);

  return (
    <CallBoxContainer>
      {peers.length > 0 && (
        <>
          <Call peer={peers[0]} socket={socket} />
          {/* {peers[1] && <Call peer={peers?.[1]} socket={socket} />} */}
        </>
      )}
      {/* {peers.map((peer, idx) => (
        <Call key={idx} peer={peer} socket={socket} />
      ))} */}
    </CallBoxContainer>
  );
};

const CallBoxContainer = styled.div`
  position: absolute;
  right: 3%;
  top: 3%;
  z-index: 3;
`;
