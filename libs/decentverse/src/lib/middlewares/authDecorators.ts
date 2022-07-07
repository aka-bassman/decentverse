import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as Auth from "./authorization";

export const Account = createParamDecorator((data, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context).getContext();
  const { account } = Auth.verifyToken(ctx.req.headers.authorization);
  return account;
});
