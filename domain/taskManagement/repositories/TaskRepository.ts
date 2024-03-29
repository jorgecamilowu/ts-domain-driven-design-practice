import { Task } from "../entities/Task";
import { TaskUpdate } from "../entities/persistance/TaskTable";

export interface TaskRepository {
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  updateOne(id: string, updateWith: TaskUpdate): Promise<void>;
  delete(id: string): Promise<void>;
}
