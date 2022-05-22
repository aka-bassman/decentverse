import React, { useRef, useEffect } from "react";
import { useWindowDimensions } from "./hooks";
import { Provider } from "react-redux";
import { client } from "./stores";
import { Game, Loop, Screen, Socket, Player } from "./containers";
import { ApolloProvider } from "@apollo/client";
import { PixiTest } from "./components";
import { useApp, AppContext, AppProvider } from "@inlet/react-pixi";
import { Canvas } from "@react-three/fiber";
import { CallRoom } from "./hooks/useCallRoom";

export const Reactverse = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Welcome to Reactverse!</h1>
      </div>
      {/* <Game /> */}
      <CallRoom />
    </ApolloProvider>
  );
};
