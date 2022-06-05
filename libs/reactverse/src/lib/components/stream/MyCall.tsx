import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShareScreenOnIcon,
  ShareScreenOffIcon,
  MicOnIcon,
  MicOffIcon,
  MicOffSmallIcon,
  CamOnIcon,
  CamOffIcon,
} from "..";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "../../stores";
import { MyVideo } from "./";
import { useInterval } from "../../hooks";
import styled from "styled-components";

export interface MyCallProps {
  socket: Soc;
}

const videoWidth = 240;
const videoHeight = 280;

export const MyCall = ({ socket }: MyCallProps) => {
  const me = useWorld((state) => state.me);
  const callRoom = useGossip((state) => state.callRoom);
  const peers = useGossip((state) => state.peers);
  const setMic = useGossip((state) => state.setMic);
  const setCam = useGossip((state) => state.setCam);
  const setLocalStream = useGossip((state) => state.setLocalStream);
  const setIsTalk = useGossip((state) => state.setIsTalk);
  const toggleScreen = useGossip((state) => state.toggleScreen);
  const addPeer = useGossip((state) => state.addPeer);
  const localVideo = useRef<HTMLVideoElement>(null);
  const screenVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    getUserMedia().then(() => {
      socket.emit("join", { roomId: "bbb", userId: me.userId, nickName: me.userId });
    });
    return () => {
      peers.map((peer) => peer.call.peer.destroy());
    };
  }, []);

  useInterval(() => {
    for (const peer of peers) {
      if (!peer.call.peer.connected) return;
      const callData = {
        id: me.userId,
        cam: callRoom.cam,
        mic: callRoom.mic,
        isTalk: callRoom.mic && callRoom.isTalk,
      };
      peer.call.peer.send(JSON.stringify(callData));
    }
  }, 500);
  const getUserMedia = async () => {
    const op = {
      video: { width: 200, height: 130 },
      audio: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);
    // stream.removeTrack(stream.getVideoTracks()[0]);
    stream.getVideoTracks()[0].enabled = false;

    // stream.getVideoTracks()[0].
    if (localVideo.current) localVideo.current.srcObject = stream;
    setLocalStream(stream);

    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);

    const pcmData = new Float32Array(analyserNode.fftSize);

    const checkVolume = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;

      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      if (sumSquares > 0.1) setIsTalk(true);
      else setIsTalk(false);
      // volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
      // window.requestAnimationFrame(onFrame);
    };
    setInterval(() => window.requestAnimationFrame(checkVolume), 300);

    return stream;
  };

  const toggleMyCam = async () => {
    const cam = !callRoom.cam;
    setCam(cam);
  };
  const toggleMyMic = async () => {
    const mic = callRoom.mic ? 0 : 100;
    setMic(mic);
  };
  const getDisplay = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    // callRoom.localStream?.addTrack(stream.getTracks()[0]);
    if (screenVideo.current) {
      if (screenVideo.current.srcObject) screenVideo.current.srcObject = null;
      else screenVideo.current.srcObject = stream;
    }
    toggleScreen(stream);
    // if (localScreen.current) localScreen.current.srcObject = stream;
  };

  return (
    <Container>
      <VideoBox>
        <NameTag>
          <div style={{ visibility: !callRoom.mic ? "visible" : "hidden" }}>
            <MicOffSmallIcon />
          </div>
          {me.userId}
        </NameTag>
        <BackLight color={callRoom.isTalk ? "#9ACD32" : "transparent"} />
        {!callRoom.cam && <Bilind />}
        <video className="Video" autoPlay muted ref={localVideo} />
        <Control>
          <IconButton onClick={getDisplay}>
            <ShareScreenOffIcon />
          </IconButton>
          <IconButton onClick={toggleMyMic}>{callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}</IconButton>
          <IconButton onClick={toggleMyCam}>{callRoom.cam ? <CamOnIcon /> : <CamOffIcon />}</IconButton>
        </Control>
      </VideoBox>
      <video className="ScreenShare" autoPlay muted ref={screenVideo} />
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 4%;
  left: 1%;
`;

const VideoBox = styled.div`
  width: 200px;
  height: 130px;
  position: relative;
  border-radius: 10px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  .Video {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    border-radius: 10px;
    z-index: 2;
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    transform: rotateY(180deg);
    -moz-transform: rotateY(180deg); /* Firefox */
  }
  .ScreenShare {
    position: absolute;
    left: 50%;
  }
`;

const Bilind = styled.div`
  position: absolute;
  align-self: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #acaaaa;
  z-index: 3;
`;

const BackLight = styled.div`
  position: absolute;
  width: 105%;
  height: 105%;
  border-radius: 10px;
  z-index: 1;
  background-color: ${(props) => props.color};
`;

const NameTag = styled.div`
  position: absolute;
  display: flex;
  padding-left: 4px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-right: 3px;
  z-index: 4;
  left: 10px;
  top: 10px;
  font-size: 13px;
  justify-items: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  background-color: rgba(59, 57, 57, 0.5);
`;
const Control = styled.div`
  position: absolute;
  left: 50%;
  bottom: 5%;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
  transform: translate(-50%, 0);
`;

const IconButton = styled.button`
  background: transparent;
`;
