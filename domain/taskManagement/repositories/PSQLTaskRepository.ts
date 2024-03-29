import { TaskRepository } from "./TaskRepository";
import { Task } from "../entities/Task";

export class PSQLTaskRepository implements TaskRepository {
  findById(id: string): Promise<Task | null> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Task[]> {
    throw new Error("Method not implemented.");
  }
  save(task: Task): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(task: Task): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
