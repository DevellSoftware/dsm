import { Model } from './model/model';
import { Structure } from './model/structure/structure';
import { Field, FieldString, FieldBoolean, FieldNumber, FieldBelongsTo, FieldHasMany } from './model/structure/field';
import { Type } from './model/structure/type';

export const dsm = {
  Model,
  Structure,
  fields: {
    Field,
    FieldString,
    FieldBoolean,
    FieldNumber,
    FieldBelongsTo,
    FieldHasMany,
  },
  Type
}
