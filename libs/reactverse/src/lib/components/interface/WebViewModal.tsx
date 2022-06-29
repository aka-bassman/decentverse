import { useState } from "react";
import { useWorld } from "../../stores";
import { XButton } from "..";
import styled from "styled-components";
import { Spin } from "antd";
import * as types from "../../stores/types";
import { isMobile } from "react-device-detect";

import { TwitterTimelineEmbed } from "react-twitter-embed";

export const WebViewModal = () => {
  const interaction = useWorld((state) => state.interaction);
  const isOpen = useWorld((state) => state.modalOpen);
  const closeModal = useWorld((state) => state.closeModal);
  const [isLoading, setIsLoadiang] = useState<boolean>(true);
  const finishLoading = () => setIsLoadiang(false);
  const close = () => {
    setIsLoadiang(true);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper webview={interaction.webview} isOpen={isOpen}>
      {interaction.webview?.purpose === "twitter" ? (
        <TwitterWrapper>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName={interaction.webview?.url}
            options={{ width: isMobile ? "100%" : "80%" }}
            onLoad={finishLoading}
          />
        </TwitterWrapper>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            // borderWidth: 1,
            display: "flex",
            // backgroundColor: "white",
            justifyContent: "center",
            // alignItems: "center",
            borderRadius: 30,
          }}
        >
          {isLoading && <Spiner size={"large"} />}
          <Webview
            id="foo"
            // data="https://www.opensea.com"
            data={interaction.webview?.url}
            // style={{ width: isLoading ? "0%" : "100%", height: isLoading ? "0%" : "120%", borderRadius: 30 }}
            onLoad={finishLoading}
          />
          <ButtonContainer>
            <CancelButton onClick={close}>
              <XButton />
            </CancelButton>
          </ButtonContainer>
        </div>
      )}
    </ModalWrapper>
  );
};

const ModalWrapper = styled("div")<{ webview: types.scalar.Webview | null; isOpen: boolean }>`
  display: ${(props) => (props.webview && props.isOpen ? "inline" : "hidden")};
  position: absolute;
  width: 1200px;
  height: 1000px;
  border-radius: 30px;
  /* background-color: white; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 800px) {
    width: 90%;
    height: 80%;
    /* height: 306px; */
    border-radius: 0px;
    /* border-width: 10px; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    /* justify-content: "center";
    align-items: "center"; */
  }
`;

const Spiner = styled(Spin)`
  position: absolute;
  background-color: white;
  top: 0;
  // right: 0;
  display: flex;
  /* border-width: 1; */
  width: 90%;
  height: 100%;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 800px) {
    position: absolute;
    background-color: white;
    top: 0;
    // right: 0;
    display: flex;
    /* border-width: 1; */
    width: 95%;
    height: 95%;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
  }
`;

const ButtonContainer = styled.div`
  background-color: transparent;
  position: absolute;
  top: 0;
  right: 0;

  @media screen and (max-width: 800px) {
    top: -10px;
    right: 0;

    z-index: 1px;
  }
`;

const CancelButton = styled.button`
  background-color: white;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
`;

const Webview = styled.object`
  width: 90%;
  height: 100%;
  border-radius: 20px;
  @media screen and (max-width: 800px) {
    width: 95%;
    height: 95%;

    z-index: 1px;
  }
`;

const TwitterWrapper = styled.div`
  & > div {
    overflow: auto;
    height: 500px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
`;
