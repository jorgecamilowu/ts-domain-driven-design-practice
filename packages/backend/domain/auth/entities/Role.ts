import type { Resource } from "../valueObjects/Resource";
import type { Permission } from "./Permission";

export class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly permissions: Permission[]
  ) {}

  getResourceAccessLevel(resource: Resource): Permission["type"] | "noAccess" {
    const access = this.permissions.find(
      (permission) =>
        permission.resource.accountId === resource.accountId &&
        permission.resource.name === resource.name
    );

    if (!access) {
      return "noAccess";
    }

    return access.type;
  }
}
