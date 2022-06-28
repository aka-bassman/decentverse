import React, { useState, useEffect } from "react";
import { client, setLink } from "./stores";
import { Stream, Game, Interface, Login, ReactverseLayout, MapEditor } from "./components";
import { io, Socket as Soc } from "socket.io-client";
import { useGossip, useWorld, useEditor, useUser, types } from "./stores";
import { Spin } from "antd";
import disableScroll from "disable-scroll";
import { isMobile } from "react-device-detect";

export interface ReactverseProps {
  uri: string;
  ws: string;
}

export const Reactverse = ({ uri, ws }: ReactverseProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Soc>();
  const worldStatus = useWorld((state) => state.status);
  const isMapEditorOpen = useEditor((state) => state.isMapEditorOpen);
  const skipLogin = false; // 나중에 query params로 넘겨야함.

  useEffect(() => {
    setLink(uri);
    const socket = io(ws);
    setSocket(socket);
    socket.on("connect", () => setIsConnected(true));
    return () => {
      console.log("");
    };
  }, []);

  if (!socket || !isConnected)
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <Spin size="large" />
          <p style={{}}>Connecting...</p>
        </div>
      </div>
    );
  else
    return (
      <ReactverseLayout>
        {isMapEditorOpen ? (
          <MapEditor />
        ) : worldStatus === "none" ? (
          <Login />
        ) : (
          <>
            <Interface socket={socket} />
            <Game socket={socket} />
            <Stream socket={socket} />
          </>
        )}
      </ReactverseLayout>
    );
};
