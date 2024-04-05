import {
  GeneratedAlways,
  Insertable,
  Nullable,
  Selectable,
  Updateable,
} from "kysely";

export interface PermissionTable {
  id: GeneratedAlways<number>;
  type: string;
  resource: string;
  roleId: Nullable<number>;
}

export type AccountResult = Selectable<PermissionTable>;
export type NewAccount = Insertable<PermissionTable>;
export type AccountUpdate = Updateable<PermissionTable>;
