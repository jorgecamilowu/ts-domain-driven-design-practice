import type { Kysely } from "kysely";

// biome-ignore lint:
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("role")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("name", "varchar")
    .execute();

  await db.schema
    .createTable("permission")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("resource", "varchar")
    .execute();

  await db.schema
    .createTable("rolePermission")
    .addColumn("roleId", "bigint", (col) =>
      col.references("role.id").onUpdate("cascade").onDelete("cascade")
    )
    .addColumn("permissionId", "bigint", (col) =>
      col.references("permission.id").onUpdate("cascade").onDelete("cascade")
    )
    .execute();
}

// biome-ignore lint:
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("role").execute();
  await db.schema.dropTable("permission").execute();
  await db.schema.dropTable("rolePermission").execute();
}
