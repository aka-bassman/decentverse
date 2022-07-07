import Reactverse, { types, ReactverseProps } from "reactverse";
const ReactVerseWrapper = () => {
  const uri = `${process.env.NEXT_PUBLIC_REACT_APP_API_PROTOCOL}://${process.env.NEXT_PUBLIC_REACT_APP_API_HOST}:${process.env.NEXT_PUBLIC_REACT_APP_API_PORT}/graphql`;
  const ws = `${process.env.NEXT_PUBLIC_WEBSOCKET_PROTOCOL}://${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}:${process.env.NEXT_PUBLIC_WEBSOCKET_PORT}`;

  const config: types.Configuration = {
    kaikas: {
      address: "0xe47e90c58f8336a2f24bcd9bcb530e2e02e1e8ae",
    },
    login: {
      logoImage: "./logo.svg",
      backgroundImage: "./back.png",
    },
  };
  return <Reactverse uri={uri} ws={ws} config={config} />;
};
export default ReactVerseWrapper;
