import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { TaskTable } from "../domain/taskManagement/entities/persistance/TaskTable";

interface Database {
  task: TaskTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "test",
    host: "127.0.0.1",
    user: "postgres",
    port: 5434,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
