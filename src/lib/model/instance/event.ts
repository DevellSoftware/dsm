import { Data } from '../structure/data';
import { Instance } from './instance';

export abstract class Event {
}

export class SetValue {
  constructor(public fieldName: string, public data: Data) {}
}

export class AddChild {
  constructor(public fieldName: string, public child: Instance) {}
}
