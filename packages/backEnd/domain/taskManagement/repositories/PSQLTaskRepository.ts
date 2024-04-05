import { TaskRepository } from "./TaskRepository";
import { Task } from "../entities/Task";
import {
  NewTask,
  TaskResult,
  TaskUpdate,
} from "../entities/persistance/TaskTable";
import { Database } from "../../../infrastructure/database";
import { Generated, Kysely } from "kysely";

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
  }: TaskResult): Task {
    return new Task(
      id,
      title,
      description,
      dueDate,
      priority,
      completed,
      createdAt
    );
  }

  async create(task: NewTask): Promise<string> {
    const { id } = await this.db
      .insertInto("task")
      .values(task)
      .returningAll()
      .executeTakeFirstOrThrow();

    return id;
  }

  async findById(id: string): Promise<Task | null> {
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
  async updateOne(id: string, updateWith: TaskUpdate): Promise<void> {
    await this.db
      .updateTable("task")
      .set(updateWith)
      .where("id", "=", id)
      .execute();
  }
  async delete(id: string): Promise<void> {
    await this.db.deleteFrom("task").where("id", "=", id).execute();
  }
}