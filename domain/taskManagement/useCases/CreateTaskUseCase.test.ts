import { describe, it, beforeEach, expect } from "bun:test";
import { CreateTaskUseCase } from "./CreateTaskUseCase";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
describe("Create Task Use Case", () => {
  let useCase: CreateTaskUseCase;
  let taskRepository: TaskRepository;

  const firstTask = new Task(
    "first-task",
    "FirstTask",
    "The first task",
    new Date(),
    Priority.MEDIUM,
    false,
    new Date()
  );

  const secondTask = new Task(
    "second-task",
    "SecondTask",
    "The second task",
    new Date(),
    Priority.HIGH,
    false,
    new Date()
  );

  const taskFixtures = [firstTask, secondTask];

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository(structuredClone(taskFixtures));
    useCase = new CreateTaskUseCase(taskRepository);
  });

  it("creates a new task", async () => {
    const id = await useCase.execute({
      title: "third-task",
      description: "The third task",
      completed: false,
      dueDate: new Date(),
      priority: Priority.LOW,
    });

    const task = await taskRepository.findById(id);

    expect(task).not.toBe(null);
    expect(task?.title).toBe("third-task");
    expect(task?.description).toBe("The third task");
    expect(task?.priority).toBe(Priority.LOW);
  });
});