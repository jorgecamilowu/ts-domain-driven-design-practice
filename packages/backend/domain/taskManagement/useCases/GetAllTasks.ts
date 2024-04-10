import type { Task } from "../entities/Task";
import type { TaskRepository } from "../repositories/TaskRepository";

export class GetAllTasks {
  constructor(private taskRepository: TaskRepository) {}

  async execute(accountId: number): Promise<Task[]> {
    return this.taskRepository.findAll(accountId);
  }
}
