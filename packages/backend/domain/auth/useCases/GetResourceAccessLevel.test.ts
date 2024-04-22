import { describe, it, expect } from "bun:test";

import { GetResourceAccessLevel } from "./GetResourceAccessLevel";
import { Role } from "../entities/Role";
import { PermissionType } from "../valueObjects/PermissionType";
import { Resource } from "../valueObjects/Resource";

describe("Role tests", () => {
  const useCase = new GetResourceAccessLevel();

  it("grants access to resources in permissions list", () => {
    const role = new Role(1, "roleName", [
      {
        id: 1,
        resource: new Resource(1, "task"),
        type: PermissionType.READ_AND_WRITE,
      },
    ]);

    expect(useCase.execute(role, new Resource(1, "task"))).resolves.toBe(
      PermissionType.READ_AND_WRITE
    );
  });

  it("denies access to resources not in permissions list", () => {
    const role = new Role(1, "roleName", [
      {
        id: 1,
        resource: new Resource(1, "task"),
        type: PermissionType.READ_AND_WRITE,
      },
    ]);

    expect(useCase.execute(role, new Resource(9, "task"))).resolves.toBe(
      PermissionType.NO_ACCESS
    );
  });
});
