import { Task } from "../entities/Task";
import { NewTask, TaskUpdate } from "../entities/TaskTable";

export interface TaskRepository {
  create(task: NewTask): Promise<string>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  updateOne(id: string, updateWith: TaskUpdate): Promise<void>;
  delete(id: string): Promise<void>;
}
