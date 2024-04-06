import type { TaskRepository } from "../repositories/TaskRepository";

export class DeleteTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: number): Promise<void> {
    return this.taskRepository.delete(taskId);
  }
}
