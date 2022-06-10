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
    // socket.on("full", () => setFull(true));
  }, []);

  return (
    <CallBoxContainer>
      <TotalUserIconBox>
        <div className="icon">{<PeoplesIcon />}</div>
        <div className="text">{peers.length}</div>
      </TotalUserIconBox>
      {peers.map((peer, idx) => (
        <Call key={peer.id} peer={peer} socket={socket} />
      ))}
    </CallBoxContainer>
  );
};

const CallBoxContainer = styled.div`
  position: absolute;
  overflow-y: scroll;
  overflow-x: hidden;
  /* overflow-y: scroll; */
  height: 100%;
  right: 0%;
  top: 0%;
  z-index: 3;
  display: inline;
  justify-content: center;
  align-content: center;
  * {
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  /* border-width: 10px; */
  padding: 30px;
  border-radius: 10px;
  background-color: #3d628467;
`;

const TotalUserIconBox = styled.div`
  background-color: #61a6df;
  width: auto;
  height: auto;
  min-width: 80px;
  max-width: 80px;
  /* line-height: 10px; */
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  color: white;
  .icon {
    margin-right: 5px;
  }
  .text {
    margin-left: 5px;
  }
`;
