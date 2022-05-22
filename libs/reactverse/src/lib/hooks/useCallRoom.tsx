import React from "react";
import { io, Socket as Soc } from "socket.io-client";
import { ShareScreenIcon, MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "../components";

import Peer from "simple-peer";
import { useEffect, useRef, useState } from "react";
const stunServer = "stun:stun4.l.google.com:19302";
export class Call {
  peer: Peer.Instance;
  constructor(stream: MediaStream, initiator: boolean) {
    console.log(initiator);
    const opt: any = {
      reconnectTimer: 1000,
      iceTransportPolicy: "relay",
    };
    this.peer = new Peer({
      initiator,
      stream: stream,
      trickle: false,
      ...opt,
      config: { iceServers: [{ urls: stunServer }] },
    });
  }
  connect(otherId: string) {
    this.peer.signal(otherId);
  }
}

export interface UseCallProps {
  // socket: Soc;
  navigator: Navigator;
}

export const CallRoom = () => {
  const call = useRef<Call>();
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<Soc>(io("192.168.31.240:3333"));
  // const [streamUrl, setStreamUrl] = useState<MediaStream>();
  // const [localStream, setLocalStream] = useState<MediaStream>();
  const streamUrl = useRef<MediaStream>();
  const localStream = useRef<MediaStream>();
  const [remoteStreamUrl, setRemoteStreamUrl] = useState("");
  const initiator = useRef(false);
  const [full, setFull] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [micState, setMicState] = useState(true);
  const [camState, setCamState] = useState(true);
  const [roomId, setRoomId] = useState("aaa");
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      const stream = await getUserMedia();
      socket.current.emit("join", { roomId });
      socket.current.on("connect", () => {
        setIsConnected(true);
        console.log("connected");
      });
      socket.current.on("init", () => (initiator.current = true));
      socket.current.on("ready", () => {
        console.log("entering..");
        enter(roomId);
      });
      socket.current.on("desc", (data) => {
        console.log("desc", data);
        if (data.type === "offer" && initiator.current) return;
        if (data.type === "answer" && !initiator.current) return;
        startCall(data);
      });
      socket.current.on("disconnected", () => (initiator.current = true));
      socket.current.on("full", () => setFull(true));
    })();
  }, []);

  const getUserMedia = async () => {
    // const getUserMedia =
    //     navigator?.mediaDevices. ||
    //     navigator?.webkitGetUserMedia ||
    //     navigator.mozGetUserMedia;
    const op = {
      video: {
        width: { min: 160, ideal: 640, max: 1280 },
        height: { min: 120, ideal: 360, max: 720 },
      },
      audio: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);
    // setStreamUrl(stream);
    // setLocalStream(stream);
    streamUrl.current = stream;
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
    // setStreamUrl(stream);
    // setLocalStream(stream);

    streamUrl.current = stream;
    localStream.current = stream;
    if (localVideo.current) localVideo.current.srcObject = stream;
    call.current?.peer.addStream(stream);
  };
  const enter = (roomId: string) => {
    if (!localStream.current || !socket.current) {
      console.log("return", localStream.current, socket.current);
      return;
    }
    setConnecting(true);
    call.current = new Call(localStream.current, initiator.current);

    call.current.peer.on("signal", (data) => {
      console.log("peersignal");
      const signal = { room: roomId, desc: data };
      socket.current.emit("signal", signal);
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

  return (
    <div className="video-wrapper">
      <div className="local-video-wrapper">
        <video autoPlay id="localVideo" muted ref={localVideo} />
      </div>
      <video autoPlay className={`${connecting || waiting ? "hide" : ""}`} id="remoteVideo" ref={remoteVideo} />

      <div className="controls">
        <button className="control-btn" onClick={getDisplay}>
          <ShareScreenIcon />
        </button>

        <button className="control-btn" onClick={setAudioLocal}>
          {micState ? <MicOnIcon /> : <MicOffIcon />}
        </button>

        <button className="control-btn" onClick={setVideoLocal}>
          {camState ? <CamOnIcon /> : <CamOffIcon />}
        </button>
      </div>

      {connecting && (
        <div className="status">
          <p>Establishing connection...</p>
        </div>
      )}
      {waiting && (
        <div className="status">
          <p>Waiting for someone...</p>
        </div>
      )}
    </div>
  );
};
