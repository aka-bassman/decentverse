import { Suspense, useRef, MutableRefObject, useEffect } from "react";
import { useWorld } from "../../stores";
export const WebViewModal = ({}) => {
  const interaction = useWorld((state) => state.interaction);
  const isOpen = useWorld((state) => state.modalOpen);

  useEffect(() => {
    console.log(interaction.webview);
  }, [interaction.webview]);
  return (
    <>
      {isOpen && (
        <div
          style={{
            display: interaction.webview && isOpen ? "flex" : "hidden",
            position: "absolute",
            top: "50%",
            left: "3%",
            borderWidth: 1,
            borderColor: "black",
          }}
        >
          <object
            id="foo"
            // data="https://www.opensea.com"
            data={interaction.webview?.url}
            style={{ display: "inline-flex", width: 640, height: 500 }}
          ></object>
          {/* <iframe
        src="https://www.youtube.com/embed/EtLrz8FMfzE"
        style={{ display: "inline-flex", width: 640, height: 480 }}
      ></iframe>
      <video
        src="https://www.youtube.com/embed/EtLrz8FMfzE"
        style={{ display: "inline-flex", width: 640, height: 480 }}
      ></video> */}
        </div>
      )}
    </>
  );
};
