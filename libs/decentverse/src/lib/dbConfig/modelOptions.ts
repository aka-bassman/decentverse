import { Types, FilterQuery, PipelineStage, Schema } from "mongoose";
export const getDefaultModelStatics = <TDocument, TSchema>() => ({
  pickOneAndWrite: async function (query: FilterQuery<TSchema>, rawData: Partial<TSchema>): Promise<TDocument> {
    const doc = await this.findOne(query);
    if (!doc) throw new Error("No Document");
    Object.assign(doc, rawData);
    return await doc.save();
  },
  pickAndWrite: async function (docId: Schema.Types.ObjectId | string, rawData: Partial<TSchema>): Promise<TDocument> {
    const doc = await this.findById(docId);
    if (!doc) throw new Error("No Document");
    Object.assign(doc, rawData);
    return await doc.save();
  },
  pickOne: async function (query: FilterQuery<TSchema>): Promise<TDocument> {
    const doc = await this.findOne(query);
    if (!doc) throw new Error("No Document");
    return doc;
  },
  pickById: async function (docId: Schema.Types.ObjectId | string): Promise<TDocument> {
    const doc = await this.findById(docId);
    if (!doc) throw new Error("No Document");
    return doc;
  },
  sample: async function (
    query: FilterQuery<TSchema>,
    size = 1,
    aggregations: PipelineStage[] = []
  ): Promise<TDocument[]> {
    return await this.aggregate([{ $match: { ...query } }, { $sample: { size } }, ...aggregations]);
  },
});
export const getDefaultQueryHelpers = <TDocument, TSchema>() => ({});
