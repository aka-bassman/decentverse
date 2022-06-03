import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server, Socket } from "socket.io";
import * as srv from "../srv";


@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(EventsGateway.name);
  constructor(private readonly rtService: srv.RtService) {}

  @SubscribeMessage("events")
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log(data);
    return from([1, 2, 3]).pipe(map((item) => ({ event: "events", data: item })));
  }

  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage("player")
  async player(client: Socket, [id, position, data, min, max]: string[]) {
    await this.rtService.updatePlayer(id, position, data);
    client.emit("players", await this.rtService.getRange(min, max));
  }

  @SubscribeMessage("register")
  async register(client: Socket, [id, data]: string[]) {
    return await this.rtService.registerCharacter(id, data);
  }

  @SubscribeMessage("characters")
  async chracters(client: Socket, ids: string[]) {
    client.emit("characters", ids, await this.rtService.characters(ids));
  }

  @SubscribeMessage("chat")
  async chat(client: Socket, id: string, data: any) {
    // client.emit("characters", ids, await this.rtService.characters(ids));
  }

  @SubscribeMessage("message")
  async message(client: Socket, from: string, to: string, data: any) {
    // client.emit("characters", ids, await this.rtService.characters(ids));
  }

  @SubscribeMessage("join")
  async join(client: Socket, { roomId, userId, nickName }: any) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    if (clients.length === 0) {
      client.join(roomId);
      client.rooms.add(roomId);
      // client.emit("init", true);
    } else if (clients.length > 0) {
      console.log("reday", client.data);
      client.join(roomId);
      client.rooms.add(roomId);
      for(const client_ of clients) {
        client_.emit("init", client.id, false, client.data);
      }
    } else {
      client.rooms.clear();
      client.leave(roomId);
      client.emit("full");
    }
    // client.on("disconnect", () => {
    //   console.log("close");
    //   client.rooms.clear();
    //   client.leave(roomId);
    // });
  }


  @SubscribeMessage("receive")
  async receive(client: Socket, {socketId, roomId, userId, nickName  }: any) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    console.log(roomId, userId, nickName, socketId);
    const receiver = clients.find(client => client.id === socketId);
    receiver.emit("receive",client.id, true, client.data);
  }

  @SubscribeMessage("signal")
  async exchange(client: Socket, { socketId, desc, roomId,  nickName, userId }: any) {
    console.log("SIGNAL", "receiver : ", socketId,  "sender : ", userId, new Date());
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    const socket = clients.find(client => client.id === socketId);
    if(!socket) return;

    socket.emit(`signal`, {desc, userId});
    let i =0;

  }

  @SubscribeMessage("disconnect")
  async disconnect(client: Socket) {
    console.log("disconnect");
    const roomId = client.rooms.values()[0];
    if (roomId) this.server.to(roomId).emit("disconnected");
    client.rooms.clear();
    client.leave(roomId);
  }
}
