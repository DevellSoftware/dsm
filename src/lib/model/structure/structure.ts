import { Field } from './field';
import { TypeStructure, TypeCollection } from './type';

export class Structure {
  private fields: Field[] = [];

  constructor(public name: string, ...fields: Field[]) {
    fields.forEach(f => this.addField(f));
  }

  addField(field: Field) {
    this.fields.push(field);
  }

  field(fieldName: string): Field {
    return this.fields.find(f => f.name == fieldName);
  }

  hasParent(name: string): boolean {
    for (const field of this.fields) {
      if (field.type == TypeStructure && field.name == name) {
        return true;
      }
    }

    return false;
  }

  hasMany(name: string): boolean {
    for (const field of this.fields) {
      if (field.type == TypeCollection && field.name == name) {
        return true;
      }
    }

    return false;
  }

  fieldDefinitions(): Field[] {
    return this.fields;
  }
}
