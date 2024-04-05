import { nanoid } from "nanoid";
import { IdempotencyStore } from "../../../infrastructure/idempotency/IdempotencyStore";
import { NewTask } from "../entities/TaskTable";
import { TaskRepository } from "../repositories/TaskRepository";

export class CreateTask {
  constructor(
    private taskRepository: TaskRepository,
    private idempotencyStore: IdempotencyStore
  ) {}

  async execute(task: NewTask, idempotencyKey?: string): Promise<number> {
    const result =
      (idempotencyKey !== undefined &&
        (await this.idempotencyStore.get<number>(idempotencyKey))) ||
      undefined;

    if (result !== undefined) {
      return result;
    }

    const id = await this.taskRepository.create({
      ...task,
      createdAt: new Date().toDateString(),
    });

    if (idempotencyKey) {
      this.idempotencyStore.set(idempotencyKey, id);
    }

    return id;
  }
}
