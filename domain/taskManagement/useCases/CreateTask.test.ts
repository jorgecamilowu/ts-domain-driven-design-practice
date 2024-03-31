import { describe, it, beforeEach, expect } from "bun:test";
import { CreateTask } from "./CreateTask";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
describe("Create Task Use Case", () => {
  let useCase: CreateTask;
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
    useCase = new CreateTask(taskRepository);
  });

  it("creates a new task", async () => {
    const id = await useCase.execute({
      title: "ThirdTask",
      description: "The third task",
      completed: false,
      dueDate: new Date(),
      priority: Priority.LOW,
    });

    const task = await taskRepository.findById(id);

    expect(task).not.toBe(null);
    expect(task?.title).toBe("ThirdTask");
    expect(task?.description).toBe("The third task");
    expect(task?.priority).toBe(Priority.LOW);
  });
});
