import { describe, it, beforeEach, expect } from "bun:test";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { DeleteTask } from "./DeleteTask";
describe("Delete Task Use Case", () => {
  let useCase: DeleteTask;
  let taskRepository: TaskRepository;

  const firstTask = new Task(
    1,
    "FirstTask",
    "The first task",
    new Date(),
    Priority.MEDIUM,
    false,
    new Date(),
    null
  );

  const secondTask = new Task(
    2,
    "SecondTask",
    "The second task",
    new Date(),
    Priority.HIGH,
    false,
    new Date(),
    null
  );

  const taskFixtures = [firstTask, secondTask];

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository(structuredClone(taskFixtures));
    useCase = new DeleteTask(taskRepository);
  });

  it("deletes an existing task", async () => {
    await useCase.execute(firstTask.id);

    const shouldBeDeleted = await taskRepository.findById(firstTask.id);
    const shouldBeFound = await taskRepository.findById(secondTask.id);

    expect(shouldBeDeleted).toBe(null);
    expect(shouldBeFound).not.toBe(null);
  });
});
