import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { TaskTable } from "../../domain/taskManagement/entities/TaskTable";
import config from "config";
import type { AccountTable } from "../../domain/auth/entities/AccountTable";
import type { RoleTable } from "../../domain/auth/entities/RoleTable";
import type { PermissionTable } from "../../domain/auth/entities/PermissionTable";
import type { RolePermissionTable } from "../../domain/auth/entities/RolePermissionTable";

export interface Database {
  account: AccountTable;
  task: TaskTable;
  role: RoleTable;
  permission: PermissionTable;
  rolePermission: RolePermissionTable;
}

export const dialect = new PostgresDialect({
  pool: new Pool({
    database: config.get("database.name"),
    host: config.get("database.host"),
    user: config.get("database.user"),
    password: config.get("database.password"),
    port: Number.parseInt(config.get("database.port")),
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
