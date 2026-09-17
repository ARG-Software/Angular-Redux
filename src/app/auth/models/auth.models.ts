import { faker } from "@faker-js/faker";
import * as Factory from "factory.ts";

export interface LoginModelUI {
  username: string;
  password: string;
}

export interface UserModelUI {
  Id: number;
  Name: string;
  Email: string;
  Login: string;
  AccountStatus?: number;
  ProfileName?: string;
}

export const LoginModelUIFactory = Factory.Sync.makeFactory<LoginModelUI>({
  username: faker.internet.username(),
  password: faker.internet.password(),
});

export const UserModelUIFactory = Factory.Sync.makeFactory<UserModelUI>({
  Id: faker.number.int({ min: 1, max: 10000 }),
  Name: faker.person.fullName(),
  Email: faker.internet.email(),
  Login: faker.internet.username(),
});
