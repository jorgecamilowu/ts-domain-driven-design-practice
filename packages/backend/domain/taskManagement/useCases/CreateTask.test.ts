import { describe, it, beforeEach, expect, spyOn } from "bun:test";
import { CreateTask } from "./CreateTask";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import type { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { InMemoryIdempotencyStore } from "../../../infrastructure/idempotency/InMemoryIdempotencyStore";
import { nanoid } from "nanoid";
import type { IdempotencyStore } from "../../../infrastructure/idempotency/IdempotencyStore";

describe("Create Task Use Case", () => {
  let useCase: CreateTask;
  let taskRepository: TaskRepository;
  let inMemoryIdempotencyStore: IdempotencyStore;

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
    inMemoryIdempotencyStore = new InMemoryIdempotencyStore({});
    useCase = new CreateTask(taskRepository, inMemoryIdempotencyStore);
  });

  it("creates a new task", async () => {
    const id = await useCase.execute({
      title: "ThirdTask",
      description: "The third task",
      completed: false,
      dueDate: new Date().toDateString(),
      priority: Priority.LOW,
    });

    const task = await taskRepository.findById(id);

    expect(task).not.toBe(null);
    expect(task?.title).toBe("ThirdTask");
    expect(task?.description).toBe("The third task");
    expect(task?.priority).toBe(Priority.LOW);
  });

  it("only creates the task once", async () => {
    spyOn(taskRepository, "create");

    const newTask = {
      title: "ThirdTask",
      description: "The third task",
      completed: false,
      dueDate: new Date().toDateString(),
      priority: Priority.LOW,
    };

    const idempotencyKey = nanoid();

    await useCase.execute(newTask, idempotencyKey);
    await useCase.execute(newTask, idempotencyKey);
    await useCase.execute(newTask, idempotencyKey);

    expect(taskRepository.create).toHaveBeenCalledTimes(1);
  });
});
