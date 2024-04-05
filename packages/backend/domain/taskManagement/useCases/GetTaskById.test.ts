import { describe, it, beforeEach, expect } from "bun:test";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { GetTaskById } from "./GetTaskById";
describe("Get Task By Id Use Case", () => {
  let useCase: GetTaskById;
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

  const taskFixtures = [firstTask];

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository(structuredClone(taskFixtures));
    useCase = new GetTaskById(taskRepository);
  });

  it("gets a new task", async () => {
    const task = await useCase.execute(firstTask.id);

    expect(task).not.toBe(null);
    expect(task?.title).toBe("FirstTask");
    expect(task?.description).toBe("The first task");
    expect(task?.priority).toBe(Priority.MEDIUM);
  });

  it("returns null when task is not found", async () => {
    const task = await useCase.execute(1111112322);

    expect(task).toBe(null);
  });
});
