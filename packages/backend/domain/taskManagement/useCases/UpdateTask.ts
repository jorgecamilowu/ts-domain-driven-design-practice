import { TaskUpdate } from "../entities/TaskTable";
import { TaskRepository } from "../repositories/TaskRepository";

export class UpdateTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: number, updateWith: TaskUpdate): Promise<void | Error> {
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      return new Error("Task not found");
    }

    await this.taskRepository.updateOne(taskId, updateWith);
  }
}
