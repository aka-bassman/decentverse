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
import { useGossip, useUser, useWorld, types } from "../../stores";
import { MyVideo } from "./";
import { useInterval } from "../../hooks";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

export interface MyCallProps {
  socket: Soc;
  roomId: string;
}

const videoWidth = 240;
const videoHeight = 280;

export const MyCall = ({ socket, roomId }: MyCallProps) => {
  // const me = useWorld((state) => state.me);
  const me = useUser((state) => state);
  const callRoom = useGossip((state) => state.callRoom);
  const peers = useGossip((state) => state.peers);
  const setMic = useGossip((state) => state.setMic);
  const setCam = useGossip((state) => state.setCam);
  const setLocalStream = useGossip((state) => state.setLocalStream);
  const setIsTalk = useGossip((state) => state.setIsTalk);
  const toggleScreen = useGossip((state) => state.toggleScreen);
  const addPeer = useGossip((state) => state.addPeer);
  const clearPeers = useGossip((state) => state.clearPeers);
  const localVideo = useRef<HTMLVideoElement>(null);
  const screenVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    getUserMedia().then(() => {
      socket.emit("join", { roomId, userId: me.user.nickname, nickName: me.user.nickname });
    });
    return () => {
      console.log("unmount my Call");
      setIsTalk(false);
      socket.emit("leave");
      peers.map((peer) => peer.call.peer.destroy());
      clearPeers();
    };
  }, []);

  useInterval(() => {
    for (const peer of peers) {
      if (!peer.call.peer.connected) return;
      const callData = {
        id: me.user.nickname,
        cam: callRoom.cam,
        mic: callRoom.mic,
        isTalk: callRoom.mic && callRoom.isTalk,
      };
      peer.call.peer.send(JSON.stringify(callData));
    }
  }, 500);
  const getUserMedia = async () => {
    const op = {
      audio: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(op);
    // stream.removeTrack(stream.getVideoTracks()[0]);

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

  return <video className="Video" autoPlay muted ref={localVideo} />;
};
