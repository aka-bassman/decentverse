import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Dialog from "./dialog.model";
import * as db from "../db";

@Injectable()
export class DialogService {
  private readonly logger = new Logger(DialogService.name);
  private loader: db.DataLoader<db.ID, db.Dialog.Doc>;
  constructor(@InjectModel(Dialog.Dialog.name) private readonly Dialog: Dialog.Mdl) {
    this.loader = db.createLoader(this.Dialog);
  }
  async load(_id?: db.ID) {
    return _id && (await this.loader.load(_id));
  }
  async loadMany(_ids: db.ID[]) {
    return await this.loader.loadMany(_ids);
  }
  async dialog(dialogId: string) {
    return await this.Dialog.pickById(dialogId);
  }
  async dialogs() {
    return await this.Dialog.find({ status: { $ne: "inactive" } });
  }
  async createDialog(data: Dialog.Input) {
    return await this.Dialog.create(data);
  }
  async updateDialog(dialogId: string, data: Partial<Dialog.Raw>) {
    return await this.Dialog.pickAndWrite(dialogId, data);
  }
  async removeDialog(dialogId: string) {
    return await this.Dialog.pickAndWrite(dialogId, { status: "inactive" });
  }
}
