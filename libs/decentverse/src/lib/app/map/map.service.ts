import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Map from "./map.model";

@Injectable()
export class MapService {
  constructor(@InjectModel(Map.Map.name) private readonly Map: Map.Mdl) {}
  async map(mapId: string) {
    return await this.Map.pickById(mapId);
  }
  async maps() {
    return await this.Map.find({ status: { $ne: "inactive" } });
  }
  async createMap(data: Map.Input) {
    return await this.Map.create(data);
  }
  async updateMap(mapId: string, data: Partial<Map.Raw>) {
    return await this.Map.pickAndWrite(mapId, data);
  }
  async removeMap(mapId: string) {
    return await this.Map.pickAndWrite(mapId, { status: "inactive" });
  }
}
