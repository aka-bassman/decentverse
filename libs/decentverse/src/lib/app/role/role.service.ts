import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Role from "./role.model";
import * as db from "../db";

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  private loader: db.DataLoader<db.ID, db.Role.Doc>;
  constructor(@InjectModel(Role.Role.name) private readonly Role: Role.Mdl) {
    this.loader = db.createLoader(this.Role);
  }
  async load(_id?: db.ID) {
    return _id && (await this.loader.load(_id));
  }
  async loadMany(_ids: db.ID[]) {
    return await this.loader.loadMany(_ids);
  }
  async role(roleId: string) {
    return await this.Role.pickById(roleId);
  }
  async roles() {
    return await this.Role.find({ status: { $ne: "inactive" } });
  }
  async createRole(data: Role.Input) {
    return await this.Role.create(data);
  }
  async updateRole(roleId: string, data: Partial<Role.Raw>) {
    return await this.Role.pickAndWrite(roleId, data);
  }
  async removeRole(roleId: string) {
    return await this.Role.pickAndWrite(roleId, { status: "inactive" });
  }
}
