import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class GetTaskById {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: number): Promise<Task | null> {
    return this.taskRepository.findById(taskId);
  }
}
