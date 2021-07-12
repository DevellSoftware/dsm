import { Field } from './field';
import { TypeStructure } from './type';

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
}
