import { describe, it, expect } from "bun:test";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { PermissionType } from "../valueObjects/PermissionType";
import { Resource } from "../valueObjects/Resource";

describe("Role tests", () => {
  it("grants access to resources in permissions list", () => {
    const resource = new Resource(1, "task");
    const role = new Role(1, "roleName", [
      new Permission(1, PermissionType.READ_AND_WRITE, resource),
    ]);

    expect(role.getResourceAccessLevel(resource)).toBe(
      PermissionType.READ_AND_WRITE
    );
  });

  it("denies access to resources not in permissions list", () => {
    const role = new Role(1, "roleName", [
      new Permission(1, PermissionType.READ_AND_WRITE, new Resource(1, "task")),
    ]);

    expect(role.getResourceAccessLevel(new Resource(9, "task"))).toBe(
      PermissionType.NO_ACCESS
    );
  });
});
