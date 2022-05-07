import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as Character from "./character.model";

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.Character.name)
    private readonly Character: Character.Mdl
  ) {}
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
