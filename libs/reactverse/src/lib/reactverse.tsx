import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { ApolloProvider } from "@apollo/client";
import { Stream, Game, Interface, InputName } from "./components";
import { io, Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, types } from "./stores";

export interface ReactverseProps {
  uri: string;
  ws: string;
}

export const Reactverse = ({ uri, ws }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const me = useWorld((state) => state.me);
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
          {me.userId === "" ? (
            <InputName socket={socket} />
          ) : (
            <>
              <Interface socket={socket} />
              <Game socket={socket} />
              <Stream socket={socket} />
            </>
          )}
        </div>
      )}
    </ApolloProvider>
  );
};
