import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { ApolloProvider } from "@apollo/client";
import { Stream, Game, Interface } from "./components";
import { io, Socket as Soc } from "socket.io-client";

export interface ReactverseProps {
  uri: string;
  ws: string;
}

export const Reactverse = ({ uri, ws }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  useEffect(() => {
    setLink(uri);
    const socket = io(ws);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
  }, []);

  return (
    <ApolloProvider client={client}>
      {isConnected && socket && (
        <div style={{ width: "100%", height: "100vh" }}>
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </div>
      )}
    </ApolloProvider>
  );
};
