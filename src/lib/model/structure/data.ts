import { Instance } from '../instance/instance';

export type DataType = string | number | boolean | Instance | Instance[];

export class Data {
  constructor(public value: DataType) {}
}
