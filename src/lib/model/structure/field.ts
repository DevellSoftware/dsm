import { Type, TypeString, TypeBoolean, TypeStructure, TypeCollection } from './type';

export class Field {
  constructor(public name: string, public type: Type) {}

  is(fieldType: Type) {
    return this.type.name == fieldType.name;
  }
}

export class Reference {
  constructor(public name) {}
}

export abstract class Relation extends Field {
  constructor(public name: string, public target: Reference, type: Type) {
    super(name, type);
  }
}

export class HasMany extends Relation {
  constructor(public name, public target: Reference) {
    super(name, target, TypeCollection);
  }
}

export class BelongsTo extends Relation {
  constructor(public name, public target: Reference) {
    super(name, target, TypeStructure);
  }
}

export const FieldString = (name: string) =>  new Field(name, TypeString);
export const FieldNumber = (name: string) =>  new Field(name, TypeBoolean);
export const FieldBoolean = (name: string) =>  new Field(name, TypeBoolean);
export const FieldHasMany = (name: string, reference: string) => new HasMany(name, new Reference(reference));
export const FieldBelongsTo = (name: string, reference?: string) => new BelongsTo(name, reference ? new Reference(reference) : null);
