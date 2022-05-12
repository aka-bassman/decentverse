import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Asset from "./asset.model";
import * as db from "../db";
@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);
  private loader: db.DataLoader<db.ID, db.Asset.Doc>;
  constructor(@InjectModel(Asset.Asset.name) private readonly Asset: Asset.Mdl) {
    this.loader = db.createLoader(this.Asset);
  }
  async load(_id?: db.ID) {
    return _id && (await this.loader.load(_id));
  }
  async loadMany(_ids: db.ID[]) {
    return await this.loader.loadMany(_ids);
  }
  async asset(assetId: string) {
    return await this.Asset.pickById(assetId);
  }
  async assets() {
    return await this.Asset.find({ status: { $ne: "inactive" } });
  }
  async createAsset(data: Asset.Input) {
    return await this.Asset.create(data);
  }
  async updateAsset(assetId: string, data: Partial<Asset.Raw>) {
    return await this.Asset.pickAndWrite(assetId, data);
  }
  async removeAsset(assetId: string) {
    return await this.Asset.pickAndWrite(assetId, { status: "inactive" });
  }
}
