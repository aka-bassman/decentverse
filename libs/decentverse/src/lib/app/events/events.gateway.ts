import { Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server, Socket } from "socket.io";
import * as srv from "../srv";

@WebSocketGateway({ cors: { origin: "*" } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(EventsGateway.name);
  constructor(private readonly rtService: srv.RtService) {}

  @SubscribeMessage("events")
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
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
  async chat(client: Socket, roomId: "public" | string, data: any) {
    if (roomId === "public") this.server.emit(`chat:${roomId}`, data);
    const sockets = this.server.of("/").in(roomId);
    return sockets.emit(`chat:${roomId}`, data);
  }

  @SubscribeMessage("join")
  async join(client: Socket, { roomId, userId, nickName }: any) {
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    console.log(roomId);
    if (clients.length === 0) {
      this.logger.log("create Room");
      client.join(roomId);
      client.rooms.add(roomId);
    } else if (clients.length > 0) {
      this.logger.log("Ready");
      console.log("clinets length : ", clients.length);
      for (const client_ of clients) {
        client_.emit("init", client.id, client.data);
      }
      client.join(roomId);
    } else {
      client.rooms.clear();
      client.leave(roomId);
      client.emit("full");
    }

    client.on("disconnect", () => {
      this.logger.log("disconnect");
      this.server.to(roomId).emit(`disconnected:${userId}`);
    });
    client.on("leave", () => {
      this.logger.log("leave");
      this.server.to(roomId).emit(`disconnected:${userId}`);
      client.rooms.clear();
      client.leave(roomId);
      // client.off("leave");
    });
  }

  @SubscribeMessage("receive")
  async receive(client: Socket, { socketId, roomId, userId, nickName }: any) {
    console.log("receive", userId);
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    const receiver = clients.find((client) => client.id === socketId);
    console.log(clients.length);
    receiver.emit("receive", client.id, client.data);
  }

  @SubscribeMessage("signal")
  async exchange(client: Socket, { socketId, desc, roomId, nickName, userId }: any) {
    // this.logger.log("SIGNAL", "receiver : ", socketId, "sender : ", userId, new Date());
    const sockets = this.server.of("/").in(roomId);
    const clients = await sockets.fetchSockets();
    client.data = { roomId, userId, nickName };
    const socket = clients.find((client) => client.id === socketId);
    if (!socket) return;
    socket.emit(`desc:${userId}`, { desc, userId });
  }

  @SubscribeMessage("leave")
  async leave(client: Socket) {
    this.logger.log("leave");
    const roomId = client.rooms.values()[0];
    if (roomId) this.server.to(roomId).emit(`disconnected:${client.id}`);
    client.rooms.clear();
    client.leave(roomId);
  }
}
