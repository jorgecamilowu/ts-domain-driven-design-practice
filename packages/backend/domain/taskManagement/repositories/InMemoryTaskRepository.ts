import { Generated } from "kysely";
import { Priority } from "../valueObjects/Priority";
import { TaskRepository } from "./TaskRepository";
import { Task } from "../entities/Task";
import { NewTask, TaskUpdate } from "../entities/persistance/TaskTable";
import { nanoid } from "nanoid";

export class InMemoryTaskRepository implements TaskRepository {
  constructor(private tasks: Task[]) {}
  async create({
    title,
    description,
    dueDate,
    priority,
    completed,
  }: NewTask): Promise<string> {
    const newTask = new Task(
      nanoid(),
      title,
      description,
      dueDate,
      priority,
      completed,
      new Date()
    );

    this.tasks = [...this.tasks, newTask];

    return newTask.id;
  }
  async findById(id: string): Promise<Task | null> {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      return null;
    }

    return task;
  }

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }
  async updateOne(id: string, updateWith: TaskUpdate): Promise<void> {
    const workingTask = await this.findById(id);

    if (!workingTask) {
      return;
    }

    Object.assign(workingTask, updateWith);
    this.tasks = this.tasks
      .filter((task) => task.id !== workingTask.id)
      .concat(workingTask);
  }
  async delete(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
