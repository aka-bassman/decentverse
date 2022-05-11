import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Map from "./map.model";
import * as db from "../db";
@Injectable()
export class MapService {
  private readonly logger = new Logger(MapService.name);
  private loader: db.DataLoader<db.ID, db.Map.Doc>;
  constructor(@InjectModel(Map.Map.name) private readonly Map: Map.Mdl) {
    this.loader = db.createLoader(this.Map);
  }
  async load(_id?: db.ID) {
    return _id && (await this.loader.load(_id));
  }
  async loadMany(_ids: db.ID[]) {
    return await this.loader.loadMany(_ids);
  }
  async map(mapId: string) {
    return await this.Map.pickById(mapId);
  }
  async maps() {
    return await this.Map.find({ status: { $ne: "inactive" } });
  }
  async createMap(data: Map.Input) {
    return await this.Map.create({
      ...data,
      totalWidth: data.tileSize * (data.tiles[0]?.length ?? 0),
      totalHeight: data.tileSize * data.tiles.length,
    });
  }
  async updateMap(mapId: string, data: Partial<Map.Raw>) {
    return await this.Map.pickAndWrite(mapId, data);
  }
  async removeMap(mapId: string) {
    return await this.Map.pickAndWrite(mapId, { status: "inactive" });
  }
}
