import React, { useRef, useEffect } from "react";
import { useWindowDimensions } from "./hooks";
import { Provider } from "react-redux";
import { client } from "./stores";
import { Game, Loop, Screen, Socket, Player, Map } from "./containers";
import { ApolloProvider } from "@apollo/client";
import { PixiTest } from "./components";
import { useApp, AppContext, AppProvider } from "@inlet/react-pixi";
import { Canvas } from "@react-three/fiber";

export const Reactverse = () => {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Welcome to Reactverse!</h1>
      </div>
      <div style={{ width: 1500, height: 1500 }}>
        <Canvas camera={{ fov: 75, near: 0.1, far: 3000, position: [0, 0, 2500] }}>
          <Game />
        </Canvas>
      </div>
      <Socket uri="localhost:3333">
        <Loop>loop</Loop>
      </Socket>
      <Screen />
    </ApolloProvider>
  );
};
