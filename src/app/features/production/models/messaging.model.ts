import { faker } from "@faker-js/faker";
import * as Factory from "factory.ts";
import { MimsSelectBoxModel } from "src/app/mims-ui/input/select-box/models/select-box.model";

export interface MessagingLoadDataModelUI {
  Id: number;
  DowntimeName: string;
  Duration: number;
  StartTime: string;
  EndTime: string;
  Options: MimsSelectBoxModel[];
}

export interface MessagingSaveDataModelUI {
  Id: number;
  Option: MimsSelectBoxModel;
}

export interface MessagingRequestModelUI {
  Id: number;
}

export const MessagingLoadDataModelUIFactory =
  Factory.makeFactory<MessagingLoadDataModelUI>({
    Id: faker.number.int(),
    DowntimeName: faker.word.sample(),
    Duration: faker.number.int(),
    StartTime: faker.date.recent().toISOString(),
    EndTime: faker.date.recent().toISOString(),
    Options: [
      {
        value: faker.number.int(),
        name: faker.word.sample(),
        selected: false,
      },
      {
        value: faker.number.int(),
        name: faker.word.sample(),
        selected: true,
      },
    ],
  }).buildList(8);

export const MessagingSaveDataModelUIFactory =
  Factory.makeFactory<MessagingSaveDataModelUI>({
    Id: faker.number.int(),
    Option: {
      value: faker.number.int(),
      name: faker.word.sample(),
      selected: faker.datatype.boolean(),
    },
  }).build();

export const MessagingRequestModelUIFactory =
  Factory.makeFactory<MessagingRequestModelUI>({
    Id: faker.number.int(),
  }).build();
