import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { useWorld } from "../../stores";
import { XButton } from "..";
import styled from "styled-components";
import { isMobile } from "react-device-detect";

export const WebViewModal = ({}) => {
  const interaction = useWorld((state) => state.interaction);
  const isOpen = useWorld((state) => state.modalOpen);
  const closeModal = useWorld((state) => state.closeModal);

  return isOpen ? (
    <div
      style={{
        display: interaction.webview && isOpen ? "inline" : "hidden",
        width: isMobile ? 400 : 1000,
        height: isMobile ? 600 : 600,
        borderRadius: 30,
        backgroundColor: "white",
        position: "absolute",
        top: isMobile ? "100%" : "50%",
        left: isMobile ? "50%" : "50%",
        transform: `translate(-50%, -50%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "transparent",
          display: "flex",
          justifySelf: "flex-end",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          marginTop: 10,
          marginRight: 10,
        }}
      >
        <button
          style={{
            backgroundColor: "transparent",
          }}
          onClick={closeModal}
        >
          <XButton />
        </button>
      </div>
      <object
        id="foo"
        // data="https://www.opensea.com"
        data={interaction.webview?.url}
        style={{ display: "inline-flex", width: "100%", height: "80%" }}
      ></object>
    </div>
  ) : (
    <></>
  );
};

const Container = styled.div`
  display: ;
`;
