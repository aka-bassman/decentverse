import { useEffect, useRef, useState } from "react";
import { MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "..";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
import { CallBox, MyCall } from "./";
export interface StreamProps {
  socket: Soc;
}

export const Stream = ({ socket }: StreamProps) => {
  const callRoom = useGossip((state) => state.callRoom);

  return (
    <>
      <MyCall socket={socket} />
      {callRoom.localStream && (
        <CallBox localStream={callRoom.localStream} screenStream={callRoom.screenStream} roomId="bbb" socket={socket} />
      )}
    </>
  );
};
