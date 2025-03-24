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
    Id: Factory.each(() => faker.number.int()),
    DowntimeName: Factory.each(() => faker.word.sample()),
    Duration: Factory.each(() => faker.number.int()),
    StartTime: Factory.each(() => faker.date.recent().toISOString()),
    EndTime: Factory.each(() => faker.date.recent().toISOString()),
    Options: Factory.each(() => [
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
    ]),
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
