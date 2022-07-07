import { useEffect, useRef, useState } from "react";
import { ShareScreenOnIcon, ShareScreenOffIcon, MicOnIcon, MicOffIcon, CamOnIcon, CamOffIcon } from "..";
import { Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types, useUser } from "../../stores";
import styled from "styled-components";

export interface MyVideoProps {
  socket: Soc;
  video: React.LegacyRef<HTMLVideoElement> | undefined;
  onToggleMic: () => void;
  onToggleCam: () => void;
  getDisplay?: () => void;
}

export const MyVideo = ({ video, onToggleMic, onToggleCam, getDisplay }: MyVideoProps) => {
  const userId = useWorld((state) => state.me.id);
  const callRoom = useGossip((state) => state.callRoom);

  return (
    <Container>
      <div className="VideoBox">
        <NameTag>
          {!callRoom.mic && <MicOffIcon />}
          {userId}
        </NameTag>
        <BackLight color={callRoom.isTalk ? "#9ACD32" : "transparent"} />
        {!callRoom.cam && (
          <div
            style={{
              position: "absolute",
              alignSelf: "center",
              width: "100%",
              height: "100%",
              borderRadius: 10,
              background: "gray",
              zIndex: 2,
            }}
          />
        )}
        <video className="Video" autoPlay muted ref={video} />
        <div className="BackLight" color={callRoom.isTalk ? "#9ACD32" : "transparent"}></div>
        <div className="Control">
          {getDisplay && (
            <button className="control-btn" style={{ background: "transparent" }} onClick={getDisplay}>
              <ShareScreenOnIcon />
            </button>
          )}
          <button className="control-btn" style={{ background: "transparent" }} onClick={onToggleMic}>
            {callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          <button className="control-btn" style={{ background: "transparent" }} onClick={onToggleCam}>
            {callRoom.cam ? <CamOnIcon /> : <CamOffIcon />}
          </button>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .NameTag {
    position: absolute;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 3px;
    padding-bottom: 3px;
    z-index: 3;
    left: 10px;
    top: 10px;
    font-size: 13px;
    color: white;
    border-radius: 10px;
    background-color: rgba(59, 57, 57, 0.5);
  }
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
  .VideoBox {
    width: 300px;
    height: 200px;
    position: relative;
    border-radius: 10px;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    .Control {
      position: absolute;
      left: 50%;
      bottom: 0%;
      z-index: 2;
      transform: translate(-50%, 0);
    }
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

const NameTag = styled.div`
  position: absolute;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 3px;
  padding-bottom: 3px;
  z-index: 3;
  left: 10px;
  top: 10px;
  font-size: 13px;
  color: white;
  border-radius: 10px;
  background-color: rgba(59, 57, 57, 0.5);
`;
