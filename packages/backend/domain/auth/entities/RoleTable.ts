import type {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface RoleTable {
  id: GeneratedAlways<number>;
  name: string;
}

export type RoleResult = Selectable<RoleTable>;
export type NewRole = Insertable<RoleTable>;
export type RoleUpdate = Updateable<RoleTable>;
