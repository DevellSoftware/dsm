import { Model } from './model/model';
import { FieldString, FieldBoolean, FieldBelongsTo, FieldHasMany } from './model/structure/field';
import { Structure } from './model/structure/structure';


describe('dsm', () => {
  const model = new Model(
    new Structure(
      "task",
      FieldString("description"),
      FieldBoolean("done"),
      FieldBelongsTo("user"),
    ),
    new Structure(
      "user",
      FieldString("username"),
      FieldHasMany("tasks", "task")
    )
  );

  it('should populate data', () => {
    const user1 = model.create("user").set("username", "filip");

    const task1 = model.create("task").populate({
      "description": "Test task",
      "done": false,
      "user": user1
    });

    expect(task1.get("description")).toEqual("Test task");
    expect(task1.get("done")).toEqual(false);
    expect(task1.get("user")).toEqual(user1);
    expect(task1.parent("user").get("username")).toEqual("filip");
  });

  it('should add children', () => {
    const user1 = model.create("user").set("username", "filip");

    const task1 = model.create("task").populate({
      "description": "Test task",
      "done": false,
    });

    user1.add("tasks", task1);

    expect(user1.get("tasks")).toContain(task1);
    expect(task1.get("user")).toEqual(user1);
    expect(task1.parent("user").get("username")).toEqual("filip");
  });
});
