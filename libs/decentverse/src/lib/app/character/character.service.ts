import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Character from "./character.model";
import * as db from "../db";

@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);
  private loader: db.DataLoader<db.ID, db.Character.Doc>;
  constructor(
    @InjectModel(Character.Character.name)
    private readonly Character: Character.Mdl
  ) {
    this.loader = db.createLoader(this.Character);
  }
  async load(_id?: db.ID) {
    return _id && (await this.loader.load(_id));
  }
  async loadMany(_ids: db.ID[]) {
    return await this.loader.loadMany(_ids);
  }
  async character(characterId: string) {
    return await this.Character.pickById(characterId);
  }
  async characters() {
    return await this.Character.find({ status: { $ne: "inactive" } });
  }
  async createCharacter(data: Character.Input) {
    return await this.Character.create(data);
  }
  async updateCharacter(characterId: string, data: Partial<Character.Raw>) {
    return await this.Character.pickAndWrite(characterId, data);
  }
  async removeCharacter(characterId: string) {
    return await this.Character.pickAndWrite(characterId, {
      status: "inactive",
    });
  }
}
