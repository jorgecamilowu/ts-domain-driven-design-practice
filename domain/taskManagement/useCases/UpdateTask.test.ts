import { describe, it, beforeEach, expect } from "bun:test";
import { CreateTask } from "./CreateTask";
import { Task } from "../entities/Task";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "../repositories/TaskRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { UpdateTask } from "./UpdateTask";
describe("Update Task Use Case", () => {
  let useCase: UpdateTask;
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

  const taskFixtures = [firstTask];

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository(structuredClone(taskFixtures));
    useCase = new UpdateTask(taskRepository);
  });

  it("updates an existing task", async () => {
    await useCase.execute(firstTask.id, {
      priority: Priority.HIGH,
    });

    const task = await taskRepository.findById(firstTask.id);

    expect(task).not.toBe(null);
    expect(task?.title).toBe("FirstTask");
    expect(task?.description).toBe("The first task");
    expect(task?.priority).toBe(Priority.HIGH);
  });

  it("returns error when task id does not exist", async () => {
    const result = await useCase.execute("non-existing id", {
      priority: Priority.HIGH,
    });

    expect(result).toBeInstanceOf(Error);
    expect(result).toMatchObject({
      message: "Task not found",
    });
  });
});
