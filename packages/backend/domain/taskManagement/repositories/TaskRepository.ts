import type { Task } from "../entities/Task";
import type { NewTask, TaskUpdate } from "../entities/TaskTable";

export interface TaskRepository {
  create(task: NewTask): Promise<number>;
  findById(id: number): Promise<Task | null>;
  findAll(accountId: number): Promise<Task[]>;
  updateOne(id: number, updateWith: TaskUpdate): Promise<void>;
  delete(id: number): Promise<void>;
}
