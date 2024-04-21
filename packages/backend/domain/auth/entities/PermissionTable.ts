import type {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import type { ResourceString } from "../valueObjects/Resource";
import type { PermissionType } from "../valueObjects/PermissionType";

export interface PermissionTable {
  id: GeneratedAlways<number>;
  type: PermissionType;
  resource: ResourceString;
}

export type PermissionResult = Selectable<PermissionTable>;
export type NewPermission = Insertable<PermissionTable>;
export type PermissionUpdate = Updateable<PermissionTable>;
