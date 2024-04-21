import config from "config";
import type { Permission } from "./Permission";
import * as jose from "jose";
import { Role } from "./Role";

export class Account {
  constructor(
    public readonly id: number,
    public name: string,
    public email: string,
    public password: string,
    public role: Role | null
  ) {}

  static async parseInfoFromJWT(
    jwt: string
  ): Promise<Omit<InstanceType<typeof Account>, "password">> {
    const jwk = config.get<jose.JWK>("auth.jwk");
    const key = await jose.importJWK(jwk);

    const { payload } = await jose.jwtVerify<{
      account: {
        id: number;
        name: string;
        email: string;
        role: {
          id: number;
          name: string;
          permissions: Permission[];
        };
      };
    }>(jwt, key);

    const { id, name, email, role } = payload.account;

    return {
      id,
      name,
      email,
      role: new Role(role.id, role.name, role.permissions),
    };
  }
}
