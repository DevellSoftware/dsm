import { Field } from './field';
import { TypeStructure, TypeCollection } from './type';

export class Structure {
  private fields: FieldDefinitions;

  constructor(public name: string, ...fields: Field[]) {
    this.fields = new FieldDefinitions(fields);
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

  fieldDefinitions(): FieldDefinitions {
    return this.fields;
  }
}

export class FieldDefinitions implements Iterable<Field> {
  constructor(private fields: Field[]) {
  }

  add(field: Field) {
    this.fields.push(field);
  }

  find(c) {
    return this.fields.find(c)
  }

  remove(fieldName: string) {
    const newFields = [];

    for (const field of this.fields) {
      if (field.name != fieldName) {
        newFields.push(field);
      }
    }

    this.fields = newFields;
  }

  [Symbol.iterator](): Iterator<Field> {
    let pointer = 0;
    const fields = (this.fields as Field[]);

    return {
      next(): IteratorResult<Field> {
        if (pointer < fields.length) {
          return {
            done: false,
            value: fields[pointer++]
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    }
  }
}
