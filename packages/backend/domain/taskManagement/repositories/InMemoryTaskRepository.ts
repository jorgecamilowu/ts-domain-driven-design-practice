import { Generated } from "kysely";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "./TaskRepository";
import { Task } from "../entities/Task";
import { NewTask, TaskUpdate } from "../entities/TaskTable";
import { nanoid } from "nanoid";

export class InMemoryTaskRepository implements TaskRepository {
  constructor(private tasks: Task[]) {}
  async create({
    title,
    description,
    dueDate,
    priority,
    completed,
  }: NewTask): Promise<number> {
    const newTask = new Task(
      123,
      title,
      description,
      (dueDate && new Date(dueDate)) || new Date(),
      priority,
      completed,
      new Date()
    );

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

  async findAll(): Promise<Task[]> {
    return this.tasks;
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
