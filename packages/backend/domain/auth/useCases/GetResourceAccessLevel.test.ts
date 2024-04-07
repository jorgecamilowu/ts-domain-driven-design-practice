import { describe, it, expect } from "bun:test";

import { GetResourceAccessLevel } from "./GetResourceAccessLevel";
import { Role } from "../entities/Role";

describe("Role tests", () => {
  const useCase = new GetResourceAccessLevel();

  it("grants access to resources in permissions list", () => {
    const role = new Role(1, "roleName", [
      {
        id: 1,
        resource: {
          accountId: 1,
          name: "task",
        },
        type: "readAndWrite",
      },
    ]);

    expect(
      useCase.execute(role, {
        accountId: 1,
        name: "task",
      })
    ).resolves.toBe("readAndWrite");
  });

  it("denies access to resources not in permissions list", () => {
    const role = new Role(1, "roleName", [
      {
        id: 1,
        resource: {
          accountId: 1,
          name: "task",
        },
        type: "readAndWrite",
      },
    ]);

    expect(
      useCase.execute(role, {
        accountId: 9,
        name: "task",
      })
    ).resolves.toBe("noAccess");
  });
});
