import type { TaskRepository } from "./TaskRepository";
import { Task } from "../entities/Task";
import type { NewTask, TaskUpdate } from "../entities/TaskTable";

export class InMemoryTaskRepository implements TaskRepository {
  private counter = 0;
  constructor(private tasks: Task[]) {}
  async create({
    title,
    description,
    dueDate,
    priority,
    completed,
    accountId,
  }: NewTask): Promise<number> {
    const newTask = new Task(
      this.counter,
      title,
      description,
      (dueDate && new Date(dueDate)) || new Date(),
      priority,
      completed,
      new Date(),
      accountId || null
    );

    this.counter++;

    this.tasks = [...this.tasks, newTask];

    return newTask.id;
  }
  async findById(id: number): Promise<Task | null> {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      return null;
    }

    return task;
  }

  async findAll(accountId: number): Promise<Task[]> {
    return this.tasks.filter((acc) => acc.accountId === accountId);
  }
  async updateOne(id: number, updateWith: TaskUpdate): Promise<void> {
    const workingTask = await this.findById(id);

    if (!workingTask) {
      return;
    }

    Object.assign(workingTask, updateWith);
    this.tasks = this.tasks
      .filter((task) => task.id !== workingTask.id)
      .concat(workingTask);
  }
  async delete(id: number): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
