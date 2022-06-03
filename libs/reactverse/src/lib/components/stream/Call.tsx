import { useEffect, useRef } from "react";
import { MicOnIcon, MicOffIcon, MicOffSmallIcon, CamOnIcon, CamOffIcon } from "..";
import { types, useGossip, useWorld } from "../../stores";
import { Socket as Soc } from "socket.io-client";
import styled from "styled-components";

export interface CallProps {
  peer: types.PeerStream;
  socket: Soc;
}
export const Call = ({ peer, socket }: CallProps) => {
  const userId = useWorld((state) => state.me.userId);
  const roomId = useGossip((state) => state.callRoom.roomId);
  const removePeer = useGossip((state) => state.removePeer);
  const peers = useGossip((state) => state.peers);
  const updatePeer = useGossip((state) => state.updatePeer);
  const mutePeer = useGossip((state) => state.mutePeer);
  const unmutePeer = useGossip((state) => state.unmutePeer);
  const blindPeer = useGossip((state) => state.blindPeer);
  const openPeer = useGossip((state) => state.openPeer);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const remoteTrack = useRef<MediaStream | null>(null);

  useEffect(() => {
    enter();

    peer.call.peer._debug = console.log;
    socket.on(`desc:${peer.id}`, (data) => {
      if (peer.call.peer.connected) return;
      console.log(2, data.userId === userId);
      peer.call.connect(data.desc);
      console.log(3, peer.id);
    });
    socket.on(`disconnected:${peer.id}`, () => {
      peer.call.peer.destroy();
      removePeer(peer.id);
    });
    return () => {
      console.log("EXIT");

      const tracks = remoteTrack.current?.getTracks();
      tracks?.forEach((track) => track.stop());
      socket.off(`desc:${peer.id}`);
      socket.off(`disconnected:${peer.id}`);
    };
  }, []);
  const enter = () => {
    peer.call.peer.on("signal", (data) => {
      console.log("SIGNAL", peer.id, peer.call.initiator, data, new Date());
      const signal = { socketId: peer.socketId, desc: data, roomId, nickName: userId, userId };
      socket.emit("signal", signal);
    });
    peer.call.peer.on("stream", (stream) => {
      // console.log("STREAM", stream);
      if (remoteVideo.current) remoteVideo.current.srcObject = stream;
    });
    peer.call.peer.on("data", (data) => {
      //? transfer Uint8Array to string and parse json
      const newData = JSON.parse(new TextDecoder().decode(data));
      updatePeer({ ...peer, ...newData });
    });
    // peer.call.peer.on("error", (err) => console.log("ERR", err));
    peer.call.peer.on("track", (track, stream) => {
      // console.log("TRACK");
      remoteTrack.current = stream;
    });
    peer.call.peer.on("error", (err) => console.log(err));
  };

  const toggleMic = () => {
    if (!remoteTrack.current) return;
    if (!peer.muted) {
      if (remoteTrack.current.getAudioTracks().length > 0)
        remoteTrack.current.getAudioTracks().forEach((track) => (track.enabled = false));
      mutePeer(peer.id);
    } else {
      if (remoteTrack.current.getAudioTracks().length > 0)
        remoteTrack.current.getAudioTracks().forEach((track) => (track.enabled = true));
      unmutePeer(peer.id);
    }
  };
  const toggleCam = () => {
    if (!remoteTrack.current) return;
    if (!peer.blind) {
      if (remoteTrack.current.getVideoTracks().length > 0)
        remoteTrack.current.getVideoTracks().forEach((track) => (track.enabled = false));
      blindPeer(peer.id);
    } else {
      if (remoteTrack.current.getVideoTracks().length > 0)
        remoteTrack.current.getVideoTracks().forEach((track) => (track.enabled = true));
      openPeer(peer.id);
    }
  };

  return (
    <Container>
      <VideoBox>
        <NameTag>
          <div style={{ visibility: !peer.mic ? "visible" : "hidden" }}>
            <MicOffSmallIcon />
          </div>
          {peer.id}
        </NameTag>
        <BackLight color={peer.isTalk ? "#9ACD32" : "transparent"} />
        {(!peer.cam || peer.blind) && <Bilind />}
        <video className="Video" autoPlay muted={peer.muted} ref={remoteVideo} />
        <Control>
          <IconButton onClick={toggleMic}>{!peer.muted ? <MicOnIcon /> : <MicOffIcon />}</IconButton>
          <IconButton onClick={toggleCam}>{!peer.blind ? <CamOnIcon /> : <CamOffIcon />}</IconButton>
        </Control>
      </VideoBox>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
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
`;

const BackLight = styled.div`
  position: absolute;
  width: 105%;
  height: 105%;
  border-radius: 10px;
  z-index: 1;
  background-color: ${(props) => props.color};
`;

const Bilind = styled.div`
  position: absolute;
  align-self: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #3c3c3c;
  z-index: 3;
`;

const NameTag = styled.div`
  position: absolute;
  display: flex;
  padding-left: 4px;
  padding-right: 12px;
  padding-top: 3px;
  padding-bottom: 3px;
  z-index: 4;
  left: 10px;
  top: 10px;
  font-size: 13px;
  justify-items: center;
  align-items: center;
  color: white;
  border-radius: 10px;
  background-color: rgba(178, 178, 178, 0.5);
`;

const Control = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0%;
  z-index: 3;
  transform: translate(-50%, 0);
`;

const IconButton = styled.button`
  background: transparent;
`;
