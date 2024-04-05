import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("task")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("title", "varchar")
    .addColumn("description", "varchar")
    .addColumn("priority", "varchar", (col) =>
      col.check(sql`priority IN ('LOW', 'MEDIUM', 'HIGH')`)
    )
    .addColumn("completed", "boolean")
    .addColumn("dueDate", "date")
    .addColumn("createdAt", "date")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("task").execute();
}
