import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Admin } from "../db";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
const secret = Buffer.from(process.env.JWT_SECRET || "", `base64`);

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.Admin.name) private readonly Admin: Admin.Mdl
  ) {}
  async admin(adminId: string) {
    return await this.Admin.pickById(adminId);
  }
  async admins() {
    return await this.Admin.find({ status: { $ne: "inactive" } });
  }
  async createAdmin(data: Admin.Input) {
    return await this.Admin.create(data);
  }
  async updateAdmin(adminId: string, data: Partial<Admin.Raw>) {
    return await this.Admin.pickAndWrite(adminId, data);
  }
  async removeAdmin(adminId: string) {
    return await this.Admin.pickAndWrite(adminId, { status: "inactive" });
  }
  async signinAdmin(accountId: string, password: string) {
    const account = await this.Admin.findOne({ accountId }).select({
      status: true,
      role: true,
      password: true,
    });
    if (!account) throw new Error("No Account");
    if (
      account.status !== "active" ||
      !(await bcrypt.compare(password, account.password || ""))
    )
      throw new Error(`not match`);
    const token = jwt.sign({ _id: account._id, role: account.role }, secret);
    return { accessToken: token };
  }
}
