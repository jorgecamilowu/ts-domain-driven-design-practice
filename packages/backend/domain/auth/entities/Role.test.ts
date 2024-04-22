import { describe, it, expect } from "bun:test";
import { Role } from "./Role";
import config from "config";
import * as jose from "jose";
import { Permission } from "./Permission";
import { PermissionType } from "../valueObjects/PermissionType";
import { Resource } from "../valueObjects/Resource";

describe("Role tests", () => {
  it("creates a Role from a JWT", async () => {
    const permissions: Permission[] = [
      new Permission(1, PermissionType.READ, new Resource(1, "task")),
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
