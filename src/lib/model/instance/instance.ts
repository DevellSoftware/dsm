
import { Event, SetValue, AddChild, RemoveChild } from './event';
import { Model } from '../model';
import { Structure } from '../structure/structure';
import { Data, DataType } from '../structure/data';
import { HasMany } from '../structure/field';
import { TypeCollection } from '../structure/type';
import { v4 as uuidv4 } from 'uuid';

export type ID = string;

export class Instance {
  public history: Event[] = [];
  public id: ID;

  constructor(private model: Model, public structure: Structure) {
    this.id = uuidv4();
  }

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
        if (!value.find(c => event.child.id == c.id)) {
          value.push(event.child);
        }
      }

      if (event instanceof RemoveChild && event.fieldName === name) {
        const index = value.indexOf(event.child);

        if (index > -1) {
          value = value.splice(value.indexOf(event.child), -1);
        }
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

    if (value == null) {
      return null;
    }

    if (!(value instanceof Instance)) {
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

  remove(name: string, child: Instance): Instance {
    const childStructure = this.model.structure((this.structure.field(name) as HasMany).target);

    if (!childStructure) {
      throw new Error("The relation is not found.");
    }

    this.history.push(new RemoveChild(name, child));

    if (child.structure.hasParent(this.structure.name) && child.get(this.structure.name) == this) {
      child.set(this.structure.name, null);
    }

    return this;
  }
}

export class ProxyInstance extends Instance {
  [key: string]: any;

  constructor(model, structure: Structure) {
    super(model, structure);

    structure.fieldDefinitions().forEach(f => {
      Object.defineProperty(this, f.name, {
        enumerable: true,

        get() {
          if (this.structure.hasParent(f.name)) {
            return this.parent(f.name);
          }

          if (this.structure.hasMany(f.name)) {
            return new ProxyCollection(this, f.name);
          }

          return this.get(f.name);
        },

        set(v) {
          return this.set(f.name, v);
        }
      })
    });
  }
}

export class ProxyCollection implements Iterable<Instance> {
  constructor(private instance: Instance, private collectionName: string) {
  }

  add(instance: Instance) {
    this.instance.add(this.collectionName, instance);
  }

  [Symbol.iterator](): Iterator<Instance> {
    let pointer = 0;
    const instances = (this.instance.get(this.collectionName) as Instance[]);

    return {
      next(): IteratorResult<Instance> {
        if (pointer < instances.length) {
          return {
            done: false,
            value: instances[pointer++]
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
