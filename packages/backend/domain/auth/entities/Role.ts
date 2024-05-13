import type { Resource } from "../valueObjects/Resource";
import type { Permission } from "./Permission";
import * as jose from "jose";
import config from "config";
import { PermissionType } from "../valueObjects/PermissionType";

export class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly permissions: Permission[]
  ) {}

  getResourceAccessLevel(resource: Resource): PermissionType {
    const access = this.permissions.find(
      (permission) =>
        permission.resource.accountId === resource.accountId &&
        permission.resource.name === resource.name
    );

    if (!access) {
      return PermissionType.NO_ACCESS;
    }

    return access.type;
  }
}
