import { useEffect, useRef, useState } from "react";
import { ShareScreenIcon, MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "../../components";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
import { CallBox } from "./CallBox";
export interface StreamProps {
  socket: Soc;
}

export const Stream = ({ socket }: StreamProps) => {
  const me = useWorld((state) => state.me);
  const callRoom = useGossip((state) => state.callRoom);
  const toggleMic = useGossip((state) => state.toggleMic);
  const toggleCam = useGossip((state) => state.toggleCam);
  const setLocalStream = useGossip((state) => state.setLocalStream);
  const toggleScreen = useGossip((state) => state.toggleScreen);
  const localVideo = useRef<HTMLVideoElement>(null);
  const localScreen = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getUserMedia();
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
    if (localVideo.current) localVideo.current.srcObject = stream;
    setLocalStream(stream);
    return stream;
  };
  const getDisplay = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    toggleScreen(stream);
    if (localScreen.current) localScreen.current.srcObject = stream;
  };
  return (
    <div className="video-wrapper">
      <div className="local-video-wrapper">
        <video autoPlay id="localVideo" muted ref={localVideo} />
      </div>
      {callRoom.localStream && (
        <CallBox localStream={callRoom.localStream} screenStream={callRoom.screenStream} roomId="bbb" socket={socket} />
      )}
      {/* <video autoPlay className={`${ connecting || waiting ? "hide" : ""}`} id="remoteVideo" ref={remoteVideo} /> */}
      <div className="controls">
        <button className="control-btn" onClick={getDisplay}>
          <ShareScreenIcon />
        </button>
        <button className="control-btn" onClick={toggleMic}>
          {callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}
        </button>
        <button className="control-btn" onClick={toggleCam}>
          {callRoom.cam ? <CamOnIcon /> : <CamOffIcon />}
        </button>
      </div>
    </div>
  );
};
