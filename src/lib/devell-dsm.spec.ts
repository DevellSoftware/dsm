import { dsm } from './devell-dsm';


describe('dsm', () => {
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

  it('should add child', () => {
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

  it('should remove child', () => {
    const user1 = model.create("user").set("username", "filip");

    const task1 = model.create("task").populate({
      "description": "Test task",
      "done": false,
    });

    user1.add("tasks", task1);

    expect(user1.get("tasks")).toContain(task1);

    user1.remove("tasks", task1);

    expect(task1.get("user")).not.toEqual(user1);
    expect(task1.parent("user")).toBeNull();
  });

  it('should allow to use easier property access', () => {
    const user1 = model.create("user")
    user1.username = "filip";

    const task1 = model.create("task");

    user1.tasks.add(task1);

    expect(user1.tasks).toContain(task1);

    user1.remove("tasks", task1);

    expect(task1.get("user")).not.toEqual(user1);
    expect(task1.parent("user")).toBeNull();
  });
});
