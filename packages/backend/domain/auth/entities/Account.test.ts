import { describe, it, expect } from "bun:test";
import { Role } from "./Role";
import config from "config";
import * as jose from "jose";
import type { Permission } from "./Permission";
import { Account } from "./Account";

describe("Account tests", () => {
  it("reads account information from a JWT", async () => {
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

    const accountInfoPayload = {
      id: 1,
      name: "AccountName",
      email: "account@mail.com",
      role: {
        id: 1,
        name: "FooRole",
        permissions,
      },
    };

    const jwt = await new jose.SignJWT({
      account: accountInfoPayload,
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("dddMonorepo:backend")
      .setExpirationTime("1h")
      .sign(key);

    const accountInfo = await Account.parseInfoFromJWT(jwt);
    expect(accountInfo).toMatchObject(accountInfoPayload);
  });
});
