import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Asset from "./asset.model";

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.Asset.name) private readonly Asset: Asset.Mdl
  ) {}
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
