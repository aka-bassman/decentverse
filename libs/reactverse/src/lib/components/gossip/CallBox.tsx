import { useEffect, useRef, useState } from "react";
import { ShareScreenIcon, MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "../components";
import { Socket as Soc } from "socket.io-client";
import { useGossip } from "src/lib/stores";

export interface CallBoxProps {
  socket: Soc;
  roomId: string;
}

export const CallBox = ({ socket, roomId }: CallBoxProps) => {
  const peers = useGossip((state) => state.peers);
  const callRoom = useGossip((state) => state.callRoom);
  const addPeer = useGossip((state) => state.addPeer);
  useEffect(() => {
    (async () => {
      const stream = await getUserMedia();
      socket.emit("join", { roomId });
      socket.on("init", () => addPeer(true, stream));
      socket.on("ready", () => {
        console.log("entering..");
        enter(roomId);
      });
      socket.on("desc", (data) => {
        console.log("desc", data);
        if (data.type === "offer" && initiator.current) return;
        if (data.type === "answer" && !initiator.current) return;
        startCall(data);
      });
      socket.on("disconnected", () => (initiator.current = false));
      //   socket.on("full", () => setFull(true));
    })();
  }, []);

  const getUserMedia = async () => {
    const op = {
      video: {
        width: { min: 160, ideal: 640, max: 1280 },
        height: { min: 120, ideal: 360, max: 720 },
      },
      audio: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);
    localStream.current = stream;
    if (localVideo.current) localVideo.current.srcObject = stream;
    return stream;
  };
  const setAudioLocal = () => {
    if (!localStream.current) return;
    if (localStream.current.getAudioTracks().length > 0)
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    setMicState(!micState);
  };
  const setVideoLocal = () => {
    if (!localStream.current) return;
    if (localStream.current.getVideoTracks().length > 0)
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    setCamState(!camState);
  };
  const getDisplay = async () => {
    if (!call) return;
    const stream = await navigator.mediaDevices.getDisplayMedia();
    // stream.oninactive = () => {
    //   this.state.peer.removeStream(this.state.localStream);
    //   getUserMedia().then(() => {
    //     this.state.peer.addStream(this.state.localStream);
    //   });
    // };
    localStream.current = stream;
    if (localVideo.current) localVideo.current.srcObject = stream;
    call.current?.peer.addStream(stream);
  };
  const enter = (roomId: string) => {
    if (!localStream.current || !socket) {
      console.log("return", localStream.current, socket);
      return;
    }
    setConnecting(true);
    call.current = new Call(localStream.current, initiator.current);
    call.current.peer.on("signal", (data) => {
      console.log("peersignal");
      const signal = { room: roomId, desc: data };
      socket.emit("signal", signal);
      console.log(signal);
    });
    call.current.peer.on("stream", (stream) => {
      console.log("stream");
      if (remoteVideo.current) remoteVideo.current.srcObject = stream;
      setConnecting(false);
      setWaiting(false);
    });
    call.current.peer.on("error", function (err) {
      console.log(err);
    });
  };
  const startCall = (otherId: string) => {
    if (!call.current) {
      console.log("callreturn");
      return;
    }
    call.current.connect(otherId);
  };

  return <div className="video-wrapper"></div>;
};
