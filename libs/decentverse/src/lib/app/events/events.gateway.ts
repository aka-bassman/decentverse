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
  async join(client: Socket, { roomId }: any) {
    client.join(roomId);
    client.rooms.add(roomId);
    console.log(roomId);
    const sockets = this.server.of("/").in(roomId);
    const allSockets = await sockets.allSockets();
    if (allSockets.size === 1) {
      sockets.emit("init");
      console.log("init");
    } else if (allSockets.size >= 2) {
      console.log("reday");
      this.server.to(roomId).emit("ready");
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

  @SubscribeMessage("signal")
  async exchange(client: Socket, { room, desc }: any) {
    console.log("signal");
    this.server.to(room).emit("desc", desc);
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
