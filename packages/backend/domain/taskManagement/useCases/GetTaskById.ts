import type { Task } from "../entities/Task";
import type { TaskRepository } from "../repositories/TaskRepository";

export class GetTaskById {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: number): Promise<Task | null> {
    return this.taskRepository.findById(taskId);
  }
}
