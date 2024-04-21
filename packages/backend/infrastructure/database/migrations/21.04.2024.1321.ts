import { type Kysely, sql } from "kysely";

// biome-ignore lint:
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("permission")
    .addColumn("type", "varchar", (col) =>
      col.check(sql`type IN ('READ', 'WRITE', 'READ_AND_WRITE', 'NO_ACCESS')`)
    )
    .execute();
}

// biome-ignore lint:
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("permission").dropColumn("type").execute();
}
