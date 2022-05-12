import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as Auth from "./authorization";

@Injectable()
export class Every implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const ctx = GqlExecutionContext.create(context);
    // const account = ctx.getContext();
    // return Auth.allow(account, ["every"], account._id);
    return true;
  }
}

@Injectable()
export class Admin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const ctx = GqlExecutionContext.create(context).getContext();
    // const { account } = Auth.verifyToken(ctx.req.headers.authorization);
    // return Auth.allow(account, ["admin", "superAdmin"], account._id);
    return true;
  }
}

@Injectable()
export class SuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const ctx = GqlExecutionContext.create(context).getContext();
    // const { account } = Auth.verifyToken(ctx.req.headers.authorization);
    // return Auth.allow(account, ["superAdmin"], account._id);
    return true;
  }
}

@Injectable()
export class User implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const ctx = GqlExecutionContext.create(context).getContext();
    // const { account } = Auth.verifyToken(ctx.req.headers.authorization);
    // return Auth.allow(account, ["user"], account._id);
    return true;
  }
}
