import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types, Schema as MongoSchema } from "mongoose";
import * as dbConfig from "../../dbConfig";
import * as bcrypt from "bcrypt";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "") || 10;

/**
 * * Akamir MongoDB Schema V2.2
 */

/**
 * 1. 스키마 설계: 스키마를 다음과 같이 작성하세요
 * ? Schema Class의 이름을 변경합니다. Template -> ClsssName
 * ? Input은 도큐먼트를 생성할 때 입력하는 field들을 작성합니다. Prop 내에는 속성을, 필드값에는 타입을 지정합니다.
 * ? SchemaFile은 도큐먼트를 생성 시 자동으로 생성되는 field들을 작성합니다. Prop 내 속성에는 반드시 default 필드가 있어야합니다.
 * * 복잡한 속성이 있는 경우, 이는 shared code로 빼서 작업하세요.
 */

@Schema()
export class Input {
  @Prop({ type: String, required: true, unique: true, index: true })
  accountId: string;

  @Prop({
    type: String,
    validate: dbConfig.validate.emailAddress,
    required: true,
    index: true,
  })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password?: string;
}
@Schema()
export class Admin extends Input {
  @Prop({
    type: String,
    enum: ["admin", "superAdmin"],
    required: true,
    default: "admin",
  })
  role: "admin" | "superAdmin";

  @Prop({
    type: String,
    enum: ["active", "inactive"],
    required: true,
    default: "active",
  })
  status: "active" | "inactive";
}
@Schema(dbConfig.defaultSchemaOptions)
export class Raw extends Admin {}

/**
 * 2. 유틸리티 설계: 스키마를 손쉽게 사용할 유틸리티를 작성하세요.
 * ? 도큐먼트의 유틸리티를 위한 method 함수를 작성하세요.
 * ? 모델의 유틸리티를 위한 static 함수를 작성하세요.
 */
const documentMethods = {
  //   testMethod: function (): IDocument {
  //     return this;
  //   },
  ...dbConfig.getDefaultDocumentMethods<Doc>(),
} as const;
const modelStatics = {
  //   testFn: async function (): Promise<IDocument> {
  //     return await this.findById("adf");
  //   },
  ...dbConfig.getDefaultModelStatics<Doc, Raw>(),
} as const;
const queryHelpers = {
  //   testFn: async function (): Promise<IDocument> {
  //     return await this.findById("adf");
  //   },
  ...dbConfig.getDefaultQueryHelpers<Doc, Raw>(),
} as const;

// * //////////////////////////////////////////////////////////
// * Auto Zone, 작성할 필요 없음
type DocMtds = typeof documentMethods;
type MdlStats = typeof modelStatics;
type QryHelps = typeof queryHelpers;
export interface DocType extends Document<Types.ObjectId, QryHelps, Raw>, DocMtds, Raw {}
export type Doc = DocType & dbConfig.DefaultSchemaFields;
export interface Mdl extends Model<Doc, QryHelps, DocMtds>, MdlStats {}
export const schema = SchemaFactory.createForClass<Raw, Doc>(Raw);
Object.assign(schema.methods, documentMethods);
Object.assign(schema.statics, modelStatics);
Object.assign(schema.query, queryHelpers);
// * Auto Zone, 작성할 필요 없음
// * //////////////////////////////////////////////////////////

/**
 * 3. 미들웨어 설계: 스키마 데이터 관리 시 사용할 미들웨어를 작성하세요.
 * ? save 시 자동으로 적용할 알고리즘을 적용하세요.
 */
schema.pre<Doc>("save", async function (next) {
  if (!this.isModified("password")) return;
  const encryptedPassword = await bcrypt.hash(this.password, saltRounds);
  this.password = encryptedPassword;
  next();
});
