import type { Kysely } from "kysely";

// biome-ignore lint:
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("task")
    .addColumn("accountId", "bigint", (col) =>
      col.references("account.id").onDelete("cascade").defaultTo(null)
    )
    .execute();
}

// biome-ignore lint:
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("task").dropColumn("accountId").execute();
}
