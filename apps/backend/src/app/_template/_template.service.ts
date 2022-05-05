import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Template } from "../db";

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.Template.name) private readonly Template: Template.Mdl
  ) {}
  async template(templateId: string) {
    return await this.Template.pickById(templateId);
  }
  async templates() {
    return await this.Template.find({ status: { $ne: "inactive" } });
  }
  async createTemplate(data: Template.Input) {
    return await this.Template.create(data);
  }
  async updateTemplate(templateId: string, data: Partial<Template.Raw>) {
    return await this.Template.pickAndWrite(templateId, data);
  }
  async removeTemplate(templateId: string) {
    return await this.Template.pickAndWrite(templateId, { status: "inactive" });
  }
}
