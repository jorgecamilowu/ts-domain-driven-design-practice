import { describe, it, expect } from "bun:test";
import { Role } from "./Role";
import config from "config";
import * as jose from "jose";
import type { Permission } from "./Permission";

describe("Role tests", () => {
  it("creates a Role from a JWT", async () => {
    const permissions: Permission[] = [
      {
        id: 1,
        resource: {
          accountId: 1,
          name: "task",
        },
        type: "read",
      },
    ];

    const jwk = config.get<jose.JWK>("auth.jwk");
    const key = await jose.importJWK(jwk);

    const alg = "HS256";

    const jwt = await new jose.SignJWT({
      id: 1,
      name: "FooRole",
      permissions,
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("dddMonorepo:backend")
      .setExpirationTime("2h")
      .sign(key);

    const role = await Role.fromJWT(jwt);
    expect(role).toMatchObject({
      id: 1,
      name: "FooRole",
      permissions,
    });
  });

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
