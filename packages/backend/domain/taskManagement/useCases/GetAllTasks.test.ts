import { describe, it, beforeEach, expect } from "bun:test";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { GetTaskById } from "./GetTaskById";
import { GetAllTasks } from "./GetAllTasks";
describe("Get All Tasks Use Case", () => {
  let useCase: GetAllTasks;
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
    useCase = new GetAllTasks(taskRepository);
  });

  it("gets a new task", async () => {
    const tasks = await useCase.execute();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).toBe(firstTask.id);
    expect(tasks[1].id).toBe(secondTask.id);
  });
});
