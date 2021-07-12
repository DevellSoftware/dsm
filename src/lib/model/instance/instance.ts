
import { Event, SetValue, AddChild } from './event';
import { Model } from '../model';
import { Structure } from '../structure/structure';
import { Data, DataType } from '../structure/data';
import { HasMany } from '../structure/field';
import { TypeCollection } from '../structure/type';

export class Instance {
  public history: Event[] = [];

  constructor(private model: Model, public structure: Structure) {}

  set(name: string, value: DataType): Instance {
    this.history.push(new SetValue(name, new Data(value)));

    return this;
  }

  get(name: string): DataType {
    let value = null;

    if (this.structure.field(name).is(TypeCollection)) {
      value = [];
    }

    for (const event of this.history) {
      if (event instanceof SetValue && event.fieldName === name) {
        value = event.data.value;
      }

      if (event instanceof AddChild && event.fieldName === name) {
        value.push(event.child);
      }
    }

    return value;
  }

  populate(values: { [key: string]: DataType }): Instance {
    for (const key in values) {
      this.set(key, values[key]);
    }

    return this;
  }

  parent(name: string): Instance {
    const value = this.get(name);

    if (value.constructor !== Instance) {
      throw new Error("Invalid value.");
    }

    return value as Instance;
  }


  add(name: string, child: Instance): Instance {
    const childStructure = this.model.structure((this.structure.field(name) as HasMany).target);

    if (!childStructure) {
      throw new Error("The relation is not found.");
    }

    this.history.push(new AddChild(name, child));

    if (child.structure.hasParent(this.structure.name)) {
      child.set(this.structure.name, this);
    }

    return this;
  }
}

// export const InstanceAccess = (instance: Instance) => new Proxy(instance, {
//   get(target, name, receiver) {
//       let rv = Reflect.get(target, name, receiver);
//       if (typeof rv === "string") {
//           rv = rv.toUpperCase();
//       }
//       return rv;
//     }
// });
