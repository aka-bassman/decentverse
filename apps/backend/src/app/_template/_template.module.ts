import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import * as Template from "./_template.model";
import { TemplateService } from "./_template.service";
import { TemplateResolver } from "./_template.resolver";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Template.Template.name, schema: Template.schema }])],
  providers: [TemplateService, TemplateResolver],
})
export class TemplateModule {}
