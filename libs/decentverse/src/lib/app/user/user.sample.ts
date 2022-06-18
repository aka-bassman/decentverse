import * as faker from "faker";
import * as User from "./user.model";
faker.setLocale("ko");
export const generateUser = () => {
  return {
    address: faker.internet.userName(),
    nickname: faker.internet.userName(),
  };
};
export const updateUser = (user: User.Input) => {
  return {
    address: user.address,
  };
};
