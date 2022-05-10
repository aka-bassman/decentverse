import * as faker from "faker";
import * as Admin from "./admin.model";
faker.setLocale("ko");
export const generateAdminInfo = () => {
  return {
    accountId: faker.internet.userName(),
    role: "admin",
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};
export const updateAdminInfo = (admin: Admin.Input) => {
  return {
    accountId: admin.accountId,
    role: "admin",
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};
