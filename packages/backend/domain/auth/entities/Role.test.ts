import { describe, it, expect } from "bun:test";
import { Role } from "./Role";

describe("Role tests", () => {
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
      role.getResourceAccessLevel({
        accountId: 1,
        name: "task",
      })
    ).toBe("readAndWrite");
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
      role.getResourceAccessLevel({
        accountId: 9,
        name: "task",
      })
    ).toBe("noAccess");
  });
});
