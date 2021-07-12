import { Instance } from '../instance/instance';

export type DataType = string | number | boolean | Instance;

export class Data {
  constructor(public value: DataType) {}
}
