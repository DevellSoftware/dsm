import { Structure } from './structure/structure';
import { Instance } from './instance/instance';
import { Reference } from './structure/field';

export class Model {
  private structures: { [key: string]: Structure } = {};

  constructor(...structures: Structure[]) {
    for (const structure of structures) {
      this.addStructure(structure);
    }
  }

  addStructure(structure: Structure) {
    this.structures[structure.name] = structure
  }

  create(name: string): Instance {
    if (typeof this.structures[name] == "undefined") {
      throw new Error("Structure not found.");
    }

    return new Instance(this, this.structures[name]);
  }

  structure(structure: string | Reference): Structure {
    for (const key in this.structures) {
      if (key == structure || key == (<Reference>structure).name) {
        return this.structures[key];
      }
    }
  }
}
