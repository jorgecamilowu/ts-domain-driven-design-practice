import type { Kysely } from "kysely";

// biome-ignore lint:
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("account")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("name", "varchar")
    .addColumn("email", "varchar")
    .addColumn("password", "varchar")
    .addColumn("roleId", "bigint", (col) =>
      col.references("role.id").onDelete("set null")
    )
    .execute();
}

// biome-ignore lint:
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("account").execute();
}
