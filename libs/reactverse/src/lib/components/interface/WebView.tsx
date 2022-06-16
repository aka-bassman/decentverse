import Iframe from "react-iframe";

export const WebView = ({}) => {
  return (
    <Iframe
      url="https://www.google.com&output=embed"
      width="450px"
      height="450px"
      id="myId"
      className="myClassname"
      display="block"
      position="relative"
    />
  );
};
