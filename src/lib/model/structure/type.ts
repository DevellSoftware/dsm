import { Data } from './data';
import { Structure } from './structure';

export class Type {
  constructor(public name: string, private validate: (data: Data) => boolean) {}
}

export const TypeString = new Type("string", data => typeof data.value === "string");
export const TypeNumber = new Type("number", data => typeof data.value === "number");
export const TypeBoolean = new Type("boolean", data => typeof data.value === "boolean");
export const TypeStructure = new Type("structure", data => data.value.constructor == Structure);
export const TypeCollection = new Type("collection", data => data.value.constructor == Array);
