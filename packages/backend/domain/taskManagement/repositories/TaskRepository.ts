import { Task } from "../entities/Task";
import { NewTask, TaskUpdate } from "../entities/TaskTable";

export interface TaskRepository {
  create(task: NewTask): Promise<number>;
  findById(id: number): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  updateOne(id: number, updateWith: TaskUpdate): Promise<void>;
  delete(id: number): Promise<void>;
}
