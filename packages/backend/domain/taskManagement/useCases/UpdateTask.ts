import type { TaskUpdate } from "../entities/TaskTable";
import type { TaskRepository } from "../repositories/TaskRepository";

export class UpdateTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    taskId: number,
    updateWith: TaskUpdate
  ): Promise<Error | undefined> {
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      return new Error("Task not found");
    }

    await this.taskRepository.updateOne(taskId, updateWith);
  }
}
