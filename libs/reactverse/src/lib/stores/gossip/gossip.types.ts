import client from "../apollo";
import gql from "graphql-tag";
import * as scalar from "../scalar.type";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";

export type ChatInput = {
  from: string;
  fromName: string;
  text: string;
  at: Date;
};
export type Chat = {
  from: string;
  fromName: string;
  text: string;
  at: Date;
};

export type MessageInput = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  text: string;
  at: Date;
};
export type Message = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  text: string;
  at: Date;
};

export const stunServer = "stun:stun4.l.google.com:19302";
export class Call {
  initiator: boolean;
  localStream: MediaStream;
  screenStream?: MediaStream;
  peer: Peer.Instance;
  constructor(initiator: boolean, localStream: MediaStream, screenStream?: MediaStream) {
    this.initiator = initiator;
    // const opt: any = {
    //   reconnectTimer: 1000,
    //   iceTransportPolicy: "relay",
    // };
    this.localStream = localStream;
    this.screenStream = screenStream;
    this.peer = new Peer({
      initiator: this.initiator,
      streams: [localStream, ...(screenStream ? [screenStream] : [])],
      trickle: false,
      // ...opt,
      config: { iceServers: [{ urls: stunServer }] },
    });
  }
  connect(otherId: string) {
    if (!this.peer) return;
    this.peer.signal(otherId);
  }
}
export type PeerStream = {
  id: string;
  nickName: string;
  call: Call;
  mic: number;
  cam: boolean;
  quality: number;
  status: "none" | "waiting" | "connecting" | "connected";
};
export type CallRoom = {
  roomId: string;
  roomType: "none" | "room" | "user" | "peer";
  mic: number;
  cam: boolean;
  fullNum: number;
  localStream?: MediaStream;
  screenStream?: MediaStream;
};
