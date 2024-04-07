import type {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import type { ResourceString } from "../valueObjects/Resource";

export interface PermissionTable {
  id: GeneratedAlways<number>;
  type: string;
  resource: ResourceString;
}

export type AccountResult = Selectable<PermissionTable>;
export type NewAccount = Insertable<PermissionTable>;
export type AccountUpdate = Updateable<PermissionTable>;
