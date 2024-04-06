import type { TaskRepository } from "./TaskRepository";
import { Task } from "../entities/Task";
import type { NewTask, TaskResult, TaskUpdate } from "../entities/TaskTable";
import type { Database } from "../../../infrastructure/database/database";
import { Generated, type Kysely } from "kysely";

export class PSQLTaskRepository implements TaskRepository {
  constructor(private db: Kysely<Database>) {}
  private mapToEntity({
    id,
    title,
    description,
    dueDate,
    priority,
    completed,
    createdAt,
    accountId,
  }: TaskResult): Task {
    return new Task(
      id,
      title,
      description,
      dueDate,
      priority,
      completed,
      createdAt,
      accountId
    );
  }

  async create(task: NewTask): Promise<number> {
    const { id } = await this.db
      .insertInto("task")
      .values(task)
      .returningAll()
      .executeTakeFirstOrThrow();

    return id;
  }

  async findById(id: number): Promise<Task | null> {
    const task = await this.db
      .selectFrom("task")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!task) {
      return null;
    }

    return this.mapToEntity(task);
  }

  async findAll(): Promise<Task[]> {
    return (await this.db.selectFrom("task").selectAll().execute()).map(
      (result) => this.mapToEntity(result)
    );
  }
  async updateOne(id: number, updateWith: TaskUpdate): Promise<void> {
    await this.db
      .updateTable("task")
      .set(updateWith)
      .where("id", "=", id)
      .execute();
  }
  async delete(id: number): Promise<void> {
    await this.db.deleteFrom("task").where("id", "=", id).execute();
  }
}
