import { IdempotencyStore } from "../../../infrastructure/idempotency/IdempotencyStore";
import { NewTask } from "../entities/persistance/TaskTable";
import { TaskRepository } from "../repositories/TaskRepository";

export class CreateTask {
  constructor(
    private taskRepository: TaskRepository,
    private idempotencyStore: IdempotencyStore
  ) {}

  async execute(task: NewTask, requestId: string): Promise<string> {
    const result = await this.idempotencyStore.get<string>(requestId);

    if (result !== undefined) {
      return result;
    }

    const id = await this.taskRepository.create(task);

    this.idempotencyStore.set(requestId, id);

    return id;
  }
}
