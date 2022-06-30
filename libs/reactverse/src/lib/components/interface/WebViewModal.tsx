import { useState } from "react";
import { useWorld } from "../../stores";
import { XButton } from "..";
import styled from "styled-components";
import { Spin } from "antd";
import * as types from "../../stores/types";
import { LinkOutlined } from "@ant-design/icons";

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
  const getIsWide = () => !(interaction.webview?.purpose === "twitter" || !interaction.webview?.isEmbed);

  if (!isOpen) return null;

  return (
    <ModalWrapper webview={interaction.webview} isOpen={isOpen} isWide={getIsWide()}>
      {!interaction.webview?.isEmbed && (
        <InnerModal>
          <LinkView>
            <h4>{interaction.webview?.message}</h4>
            <div>
              <a href={interaction.webview?.url} target="_blank" rel="noreferrer">
                {interaction.webview?.url}
                <LinkOutlined />
              </a>
            </div>
          </LinkView>

          <ButtonContainer>
            <CancelButton onClick={close}>
              <XButton />
            </CancelButton>
          </ButtonContainer>
        </InnerModal>
      )}

      {interaction.webview?.isEmbed && interaction.webview?.purpose === "twitter" && interaction.webview.url && (
        <InnerModal>
          {isLoading && <Spiner size={"large"} />}
          <TwitterWrapper>
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName={interaction.webview.url}
              options={{ width: "100%" }}
              onLoad={finishLoading}
            />
          </TwitterWrapper>
          <ButtonContainer>
            <CancelButton onClick={close}>
              <XButton />
            </CancelButton>
          </ButtonContainer>
        </InnerModal>
      )}

      {interaction.webview?.isEmbed && interaction.webview?.purpose !== "twitter" && (
        <InnerModal>
          {isLoading && <Spiner size={"large"} />}
          <Webview data={interaction.webview?.url} onLoad={finishLoading} />
          <ButtonContainer>
            <CancelButton onClick={close}>
              <XButton />
            </CancelButton>
          </ButtonContainer>
        </InnerModal>
      )}
    </ModalWrapper>
  );
};

const ModalWrapper = styled("div")<{ webview: types.scalar.Webview | null; isOpen: boolean; isWide: boolean }>`
  position: absolute;
  display: ${(props) => (props.webview && props.isOpen ? "inline" : "hidden")};
  width: ${(props) => (props.webview && props.isWide ? "1200px" : "900px")};
  height: 80vh;

  border-radius: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  @media screen and (max-width: 800px) {
    width: 95%;
    height: 95%;
    border-radius: 0px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
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
  overflow-x: hidden;

  @media screen and (max-width: 800px) {
    width: 95%;
    height: 80vh;
  }
`;

const TwitterWrapper = styled.div`
  width: 90%;
  height: 80vh;
  border-radius: 20px;
  overflow: hidden;
  & > div {
    overflow: auto;
    height: 80vh;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    @media screen and (max-width: 800px) {
      height: 80vh;
    }
  }
`;

const LinkView = styled.div`
  background-color: #fff;
  padding: 20px;
  width: 760px;
  height: fit-content;
  border-radius: 20px;
  h4 {
    font-size: 1.6em;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  a {
    font-size: 1.2em;
  }
  svg {
    vertical-align: baseline;
  }
  @media screen and (max-width: 800px) {
    width: 95%;
  }
`;

const InnerModal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 30;
`;
