import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { Stream, Game, Interface, Login, ReactverseLayout, MapEditor, GameLoading } from "./components";
import { io, Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, useEditor, useUser, types } from "./stores";

export interface ReactverseProps {
  uri: string;
  ws: string;
  config?: types.Configuration;
}

export const Reactverse = ({ uri, ws, config }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const worldStatus = useWorld((state) => state.status);
  const isMapEditorOpen = useEditor((state) => state.isMapEditorOpen);
  const loader = useWorld((state) => state.loader);
  const isLoaded = useWorld((state) => state.isLoaded);
  const initWorld = useWorld((state) => state.initWorld);
  const setupConfiguration = useWorld((state) => state.setupConfiguration);
  const loadingStatus = useWorld((state) => state.loadingStatus);
  const loginAsGuest = useWorld((state) => state.loginAsGuest);

  useEffect(() => {
    config && setupConfiguration(config);
    setLink(uri);
    const socket = io(ws);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
    const url = window.location.href;
    if (url.includes("guest=true")) {
      loadingStatus();
      loginAsGuest();
      initWorld();
    }
  }, []);
  if (!socket || !isConnected) return;

  return (
    <ReactverseLayout>
      {worldStatus === "none" ? (
        <Login />
      ) : (
        <>
          {/* {!isLoaded() && <GameLoading />} */}
          <Interface socket={socket} />
          <Game socket={socket} />
          <Stream socket={socket} />
        </>
      )}
    </ReactverseLayout>
  );
};
