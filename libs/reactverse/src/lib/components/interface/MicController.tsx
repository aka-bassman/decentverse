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
import { useInterval } from "../../hooks";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

export const MicController = ({}) => {
  // const me = useWorld((state) => state.me);
  const interaction = useWorld((state) => state.interaction);
  const callRoom = useGossip((state) => state.callRoom);
  const setMic = useGossip((state) => state.setMic);

  const toggleMyMic = async () => {
    const mic = callRoom.mic ? 0 : 100;
    setMic(mic);
  };

  return (
    <Container>
      {!isMobile && callRoom.roomId && (
        <Control>
          <IconButton onClick={toggleMyMic}>{callRoom.mic ? <MicOnIcon /> : <MicOffIcon />}</IconButton>
        </Control>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  /* border-width: 10px; */
`;

const Control = styled.div`
  bottom: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
  transform: translate(-50%, 0);
`;
const MobileControl = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 3;
  /* transform: translate(-50%, 0); */
`;

const IconButton = styled.button`
  background: white;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200px;
`;
