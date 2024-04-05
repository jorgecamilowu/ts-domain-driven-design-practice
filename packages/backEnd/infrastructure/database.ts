import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { TaskTable } from "../domain/taskManagement/entities/persistance/TaskTable";
import config from "config";

export interface Database {
  task: TaskTable;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.get("database.name"),
    host: config.get("database.host"),
    user: config.get("database.user"),
    password: config.get("database.password"),
    port: parseInt(config.get("database.port")),
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
