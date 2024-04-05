import { TaskUpdate } from "../entities/persistance/TaskTable";
import { TaskRepository } from "../repositories/TaskRepository";

export class UpdateTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, updateWith: TaskUpdate): Promise<void | Error> {
    const existingTask = await this.taskRepository.findById(taskId);

    if (!existingTask) {
      return new Error("Task not found");
    }

    await this.taskRepository.updateOne(taskId, updateWith);
  }
}
