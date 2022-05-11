import { SchemaOptions, Types } from "mongoose";
export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true },
  // id: true,
  // _id: true,
};

// @Schema({ timestamps: true })
export class DefaultSchemaFields {
  // _id: Types.ObjectId;

  // id: string;

  // @Prop()
  createdAt: Date;

  // @Prop()
  updatedAt: Date;
}
