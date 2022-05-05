import { Logger } from "@nestjs/common";
import { Model, FilterQuery } from "mongoose";

interface BatchForm<Doc> {
  name: string;
  model: Model<Doc>;
  query: FilterQuery<Doc>;
  fn?: (docs: Doc[]) => Promise<any>;
  mapFn?: (doc: Doc) => Promise<any>;
  batchNum?: number;
}
export const batchProcess = async <Doc>({ name, model, query, fn, mapFn, batchNum = 100 }: BatchForm<Doc>) => {
  Logger.log(`${name} Batch Job Started`);
  const num = await model.countDocuments(query);
  for (let i = 0; i < num; i += batchNum) {
    Logger.log(`${name} Batch Job Processing... ${i}/${num}`);
    const docs = await model.find(query).skip(i).limit(batchNum);
    mapFn && (await Promise.all(docs.map(async (doc) => await mapFn(doc))));
    fn && (await fn(docs));
  }
  Logger.log(`${name} Batch Job Finished`);
  return num;
};
