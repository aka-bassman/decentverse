import Reactverse from "reactverse";
const ReactVerseWrapper = () => {
  const uri = `${process.env.NEXT_PUBLIC_REACT_APP_API_PROTOCOL}://${process.env.NEXT_PUBLIC_REACT_APP_API_HOST}:${process.env.NEXT_PUBLIC_REACT_APP_API_PORT}`;
  const ws = `${process.env.NEXT_PUBLIC_WEBSOCKET_PROTOCOL}://${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}:${process.env.NEXT_PUBLIC_WEBSOCKET_PORT}`;
  return <Reactverse uri={uri} ws={ws} />;
};
export default ReactVerseWrapper;
