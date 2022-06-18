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
  const peers = useGossip((state) => state.peers);
  const interaction = useWorld((state) => state.interaction);

  useEffect(() => {
    console.log(peers.length);
  }, [peers]);
  return (
    <>
      {interaction.callRoom && <MyCall socket={socket} roomId={interaction.callRoom._id} />}
      {interaction.callRoom && callRoom.localStream && (
        <CallBox
          localStream={callRoom.localStream}
          screenStream={callRoom.screenStream}
          roomId={interaction.callRoom._id}
          socket={socket}
        />
      )}
    </>
  );
};
