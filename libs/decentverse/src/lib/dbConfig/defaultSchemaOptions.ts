import { SchemaOptions, Types, Schema } from "mongoose";
export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  validateBeforeSave: true,
  // id: true,
  // _id: true,
};

// @Schema({ timestamps: true })
export class DefaultSchemaFields {
  _id: Schema.Types.ObjectId;

  // id: string;

  // @Prop()
  createdAt: Date;

  // @Prop()
  updatedAt: Date;
}
