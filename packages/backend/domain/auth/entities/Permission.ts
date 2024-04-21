import type { PermissionType } from "../valueObjects/PermissionType";
import type { Resource } from "../valueObjects/Resource";

export interface Permission {
  readonly id: number;
  readonly type: PermissionType;
  readonly resource: Resource;
}
