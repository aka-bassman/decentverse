import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as User from "./user.model";
import { ethers } from "ethers";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as db from "../db";
import { address } from "faker";
const secret = Buffer.from(process.env.JWT_SECRET || "", `base64`);

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private loader: db.DataLoader<db.ID, db.User.Doc>;
  constructor(@InjectModel(User.User.name) private readonly User: User.Mdl) {
    this.loader = db.createLoader(this.User);
  }

  async checkSignature(message: string, signAddress: string) {
    const current = new Date().getTime();

    const timeString = "timeStamp:";
    const timeIndex = message.indexOf(timeString) + timeString.length;
    const timeStamp = parseInt(message.slice(timeIndex, message.length));
    const diffMin = Math.floor((current - timeStamp) / 1000 / 60);

    //if difference is over to 10 minute?
    if (diffMin > 10) throw new Error("this signature has expired.");

    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    return ethers.utils.recoverAddress(msgHashBytes, signAddress).toLowerCase();
  }

  async load(_id?: db.ID) {
    return _id && (await this.loader.load(_id));
  }

  async loadMany(_ids: db.ID[]) {
    return await this.loader.loadMany(_ids);
  }

  async whoAmI(address: string, message: string, signAddress: string) {
    return (
      (await this.User.findOne({ address: address.toLowerCase() })) ??
      (await this.User.create({
        address: address.toLowerCase(),
      }))
    );
  }

  async users() {
    return await this.User.find({ status: { $ne: "inactive" } });
  }

  async createUser(data: User.Input) {
    return await this.User.create(data);
  }

  async updateUser(UserId: string, data: Partial<User.Raw>) {
    return await this.User.pickAndWrite(UserId, data);
  }

  async removeUser(UserId: string) {
    return await this.User.pickAndWrite(UserId, { status: "inactive" });
  }
}