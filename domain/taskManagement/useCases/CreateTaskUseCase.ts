import { NewTask } from "../entities/persistance/TaskTable";
import { TaskRepository } from "../repositories/TaskRepository";

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: NewTask): Promise<string> {
    const id = await this.taskRepository.create(task);

    return id;
  }
}
