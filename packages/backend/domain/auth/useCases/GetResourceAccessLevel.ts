import type { Role } from "../entities/Role";
import type { Resource } from "../valueObjects/Resource";

export class GetResourceAccessLevel {
  async execute(
    role: Role,
    resource: Resource
  ): Promise<"read" | "write" | "readAndWrite" | "noAccess"> {
    return role.getResourceAccessLevel(resource);
  }
}
