import React, { useRef, useEffect } from "react";
import { useWindowDimensions } from "./hooks";
import { Provider } from "react-redux";
import { client } from "./stores";
import { Game, Loop, Screen, Socket, Player, Map } from "./containers";
import { ApolloProvider } from "@apollo/client";
import { PixiTest } from "./components";
import { useApp, AppContext, AppProvider } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

// export interface ReactverseProps {
//   a: any;
// }

const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x5bba6f,
});

export const Reactverse = () => {
  const ref = useRef<any>(null);

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Welcome to Reactverse!</h1>
      </div>
      {/* <AppProvider value={app}>
          <PixiTest />
        </AppProvider> */}
      {/* <div style={{ width: 1000, height: 1000 }}></div> */}
      {/* <World /> */}
      <Game>
        <Map />
        <Player />
      </Game>
      <Socket uri="localhost:3333">
        <Loop>loop</Loop>
      </Socket>
      <Screen />
    </ApolloProvider>
  );
};
