import { TaskRepository } from "../repositories/TaskRepository";

export class DeleteTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<void> {
    return this.taskRepository.delete(taskId);
  }
}
