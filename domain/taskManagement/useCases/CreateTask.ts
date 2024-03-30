import { NewTask } from "../entities/persistance/TaskTable";
import { TaskRepository } from "../repositories/TaskRepository";

export class CreateTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: NewTask): Promise<string> {
    return this.taskRepository.create(task);
  }
}
