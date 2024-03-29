import { nanoid } from "nanoid";
import { Task } from "./Task";
import { describe, it, expect, beforeEach } from "bun:test";
import { Priority } from "../valueObjects/Priority";

describe("Task entity", () => {
  let task: Task;

  beforeEach(() => {
    task = new Task(
      nanoid(),
      "title",
      "description",
      new Date(),
      Priority.MEDIUM,
      false
    );
  });

  it("marks as completed", () => {
    expect(task.completed).toBe(false);
    task.markAsCompleted();
    expect(task.completed).toBe(true);
  });

  it("marks as pending", () => {
    expect(task.completed).toBe(false);
    task.markAsCompleted();
    expect(task.completed).toBe(true);
    task.markAsPending();
    expect(task.completed).toBe(false);
  });

  it("updates partial details", () => {
    expect(task.title).toBe("title");
    expect(task.description).toBe("description");
    task.updateDetails({
      title: "foo title",
      description: "bar description",
    });

    expect(task.title).toBe("foo title");
    expect(task.description).toBe("bar description");
  });
});
