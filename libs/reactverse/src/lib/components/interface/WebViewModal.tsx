import { useState } from "react";
import { useWorld } from "../../stores";
import { XButton } from "..";
import styled from "styled-components";
import { Spin } from "antd";
import * as types from "../../stores/types";

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
  return isOpen ? (
    <ModalWrapper webview={interaction.webview} isOpen={isOpen}>
      <ButtonContainer>
        <CancelButton onClick={close}>
          <XButton />
        </CancelButton>
      </ButtonContainer>

      {isLoading && (
        <Spin
          size="large"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}
        />
      )}
      <Webview
        id="foo"
        // data="https://www.opensea.com"
        data={interaction.webview?.url}
        style={{ width: isLoading ? "0%" : "100%", height: isLoading ? "0%" : "80%" }}
        onLoad={finishLoading}
      />
    </ModalWrapper>
  ) : (
    <></>
  );
};

const ModalWrapper = styled("div")<{ webview: types.scalar.Webview | null; isOpen: boolean }>`
  display: ${(props) => (props.webview && props.isOpen ? "inline" : "hidden")};
  position: absolute;
  width: 1000px;
  height: 600px;
  border-radius: 30px;
  background-color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: "center";
  align-items: "center";
  @media screen and (max-width: 800px) {
    width: 90%;
    height: 80%;
    border-radius: 30px;
    /* border-width: 10px; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    justify-content: "center";
    align-items: "center";
  }
`;

const ButtonContainer = styled.div`
  background-color: transparent;
  display: flex;
  justify-self: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
  @media screen and (max-width: 800px) {
    margin-top: 3px;
    margin-bottom: 3px;
    z-index: 1px;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  margin-right: 10px;
  margin-top: 10px;
`;

const Webview = styled.object`
  display: inline-flex;
  width: 100%;
  height: 80%;
  min-height: 80%;
  max-height: 80%;
`;
