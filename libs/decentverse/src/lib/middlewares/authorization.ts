import * as jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";

const secret = Buffer.from(process.env.JWT_SECRET || "", `base64`);

export const verifyToken = (authorization: string | undefined) => {
  const token =
    authorization &&
    authorization.split(" ")[0] === "Bearer" &&
    authorization.split(" ")[1];
  if (!token) return { account: null };
  const account: any = jwt.verify(token, secret);
  if (account.status === "inactive") return { account: null };
  return { account };
};

export const allow = (account: any, roles: string[], userId?: any) => {
  // if (!account || !(roles.includes(account.role) || roles.includes("every")))
  //   throw new AuthenticationError("Authentication Failed");
  // else if (userId && account.role === "user" && !account._id === userId)
  //   throw new AuthenticationError("Invalid User");
  return true;
};

export const allowExcept = (account: any, roles: string[], userId?: any) => {
  // if (!account || roles.includes(account.role))
  //   throw new AuthenticationError("Authentication Failed");
  // else if (userId && account.role === "user" && !account._id === userId)
  //   throw new AuthenticationError("Invalid User");
  return true;
};

export const handleUnauthorized = () => {
  throw new AuthenticationError("Authentication Failed");
};
