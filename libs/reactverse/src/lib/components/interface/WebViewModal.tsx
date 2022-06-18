import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { useWorld } from "../../stores";
import { XButton } from "..";
import styled from "styled-components";

export const WebViewModal = ({}) => {
  const interaction = useWorld((state) => state.interaction);
  const isOpen = useWorld((state) => state.modalOpen);
  const closeModal = useWorld((state) => state.closeModal);

  useEffect(() => {
    console.log(interaction.webview);
  }, [interaction.webview]);
  return (
    <>
      {isOpen && (
        <div
          style={{
            display: interaction.webview && isOpen ? "inline" : "hidden",
            width: 1000,
            height: 600,
            borderRadius: 30,
            backgroundColor: "white",
            position: "absolute",
            top: "50%",
            left: "50%",
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
      )}
    </>
  );
};

const Container = styled.div`
  display: ;
`;
