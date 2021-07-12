# Devell DSM

Oh hello there.

* Do you need a typescript library for working with modeled state objects?
* Do you want to do it really quick?
* Do you want easy use the structure to persist data in the browser and on the server?

Then you can use this library, which I wrote for myself when having similar needs.

Everything is still under heavy development, but the tested part works great.

## Basic usage

### Define model structure

```
import { dsm } from './devell-dsm';

const model = new dsm.Model(
  new dsm.Structure(
    "task",
    dsm.fields.FieldString("description"),
    dsm.fields.FieldBoolean("done"),
    dsm.fields.FieldBelongsTo("user"),
  ),
  new dsm.Structure(
    "user",
    dsm.fields.FieldString("username"),
    dsm.fields.FieldHasMany("tasks", "task")
  )
);
```

### Create instances and work on their data

```
const user = model.create("user").set("username", "filip");

const task = model.create("task").populate({
  "description": "Test task",
  "done": false,
  "user": user
});

console.log(task.get("description")) // Test task
console.log(task.get("user")) // user
console.log(task.parent("user").get("username")) // filip
```
