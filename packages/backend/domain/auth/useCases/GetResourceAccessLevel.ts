import type { Role } from "../entities/Role";
import type { PermissionType } from "../valueObjects/PermissionType";
import type { Resource } from "../valueObjects/Resource";

export class GetResourceAccessLevel {
  async execute(role: Role, resource: Resource): Promise<PermissionType> {
    return role.getResourceAccessLevel(resource);
  }
}
