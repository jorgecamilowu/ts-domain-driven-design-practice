import { type Kysely, sql } from "kysely";

// biome-ignore lint:
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

// biome-ignore lint:
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("task").execute();
}
