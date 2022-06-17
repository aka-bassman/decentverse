export const WebView = ({}) => {
  return (
    <>
      <object
        id="foo"
        data="https://www.opensea.com"
        style={{ display: "inline-flex", width: 640, height: 480 }}
      ></object>
      <iframe
        src="https://www.youtube.com/embed/EtLrz8FMfzE"
        style={{ display: "inline-flex", width: 640, height: 480 }}
      ></iframe>
      <video
        src="https://www.youtube.com/embed/EtLrz8FMfzE"
        style={{ display: "inline-flex", width: 640, height: 480 }}
      ></video>
    </>
  );
};
