import { useEffect, useRef } from "react";
import { types, useGossip, useWorld } from "../../stores";
import { Socket as Soc } from "socket.io-client";

export interface CallProps {
  peer: types.PeerStream;
  socket: Soc;
}
export const Call = ({ peer, socket }: CallProps) => {
  const userId = useWorld((state) => state.me.userId);
  const roomId = useGossip((state) => state.callRoom.roomId);
  const removePeer = useGossip((state) => state.removePeer);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const remoteScreen = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    enter();
    socket.on(`desc:${peer.id}`, (data) => {
      console.log("desc", data);
      if (data.type === "offer" && peer.call.initiator) return;
      if (data.type === "answer" && !peer.call.initiator) return;
      peer.call.connect(data);
    });
    socket.on(`disconnected:${peer.id}`, () => {
      removePeer(peer.id);
    });
    return () => {
      console.log("exit call");
      //   peer.call.peer.destroy();
      socket.off(`desc:${peer.id}`);
      socket.off(`disconnected:${peer.id}`);
    };
  }, []);
  const enter = () => {
    peer.call.peer.on("signal", (data) => {
      console.log("peersignal");
      const signal = { room: roomId, desc: data, userId };
      socket.emit("signal", signal);
      console.log(signal);
    });
    peer.call.peer.on("stream", (stream) => {
      console.log("stream");
      if (remoteVideo.current) remoteVideo.current.srcObject = stream;
    });
    peer.call.peer.on("error", (err) => console.log(err));
  };
  return (
    <video autoPlay className={`${remoteVideo.current?.srcObject ? "hide" : ""}`} id="remoteVideo" ref={remoteVideo} />
  );
};
