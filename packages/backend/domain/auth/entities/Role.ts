import type { Resource } from "../valueObjects/Resource";
import type { Permission } from "./Permission";
import * as jose from "jose";
import config from "config";

export class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly permissions: Permission[]
  ) {}

  static async fromJWT(jwt: string) {
    const jwk = config.get<jose.JWK>("auth.jwk");
    const key = await jose.importJWK(jwk);

    const { payload } = await jose.jwtVerify<{
      id: number;
      name: string;
      permissions: Permission[];
    }>(jwt, key);

    return new Role(payload.id, payload.name, payload.permissions);
  }

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
