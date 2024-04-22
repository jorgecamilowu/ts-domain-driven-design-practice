import type { Kysely } from "kysely";
import type { Database } from "../../../infrastructure/database/database";
import { Account } from "../entities/Account";
import type { NewAccount } from "../entities/AccountTable";
import type { AccountRepository } from "./AccountRepository";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import type { PermissionType } from "../valueObjects/PermissionType";
import { Resource, type ResourceString } from "../valueObjects/Resource";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import type { PasswordHasher } from "../services/PasswordHasher";

export class PSQLAccountRepository implements AccountRepository {
  constructor(
    private db: Kysely<Database>,

    private passwordHasher: PasswordHasher
  ) {}

  private mapToEntity(account: {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
    role: {
      name: string;
    };
    permissions: {
      id: number;
      type: PermissionType;
      resource: ResourceString;
    }[];
  }): Account {
    const newRole = new Role(
      account.roleId,
      account.role.name,
      account.permissions.map(({ id, resource, type }) => ({
        id,
        type,
        resource: Resource.fromResourceString(resource),
      }))
    );

    const newAccount = new Account(
      account.id,
      account.name,
      account.email,
      account.password,
      newRole
    );

    return newAccount;
  }

  async create(account: NewAccount): Promise<number> {
    const result = await this.db.transaction().execute(async (trx) => {
      const hashedPassword = await this.passwordHasher.hashPassword(
        account.password
      );

      const { id: roleId } = await trx
        .insertInto("role")
        .values({
          name: "DefaultRole",
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      const { id: accountId } = await trx
        .insertInto("account")
        .values({ ...account, roleId, password: hashedPassword })
        .returningAll()
        .executeTakeFirstOrThrow();

      const defaultPermissions = Permission.getDefaultPermissions(accountId);

      const permissionIds = await trx
        .insertInto("permission")
        .values(
          defaultPermissions.map(({ resource, type }) => ({
            type,
            resource: resource.toString(),
          }))
        )
        .returning("id")
        .execute();

      await trx
        .insertInto("rolePermission")
        .values(
          permissionIds.map((permission) => ({
            permissionId: permission.id,
            roleId,
          }))
        )
        .execute();

      return accountId;
    });

    return result;
  }
  async findById(id: number): Promise<Account | null> {
    const account = await this.db
      .selectFrom("account")
      .where("id", "=", id)
      .selectAll()
      .select((eb) => [
        jsonObjectFrom(
          eb
            .selectFrom("role")
            .select("role.name")
            .whereRef("account.roleId", "=", "role.id")
        ).as("role"),
        jsonArrayFrom(
          eb
            .selectFrom("rolePermission")
            .whereRef("account.roleId", "=", "rolePermission.roleId")
            .innerJoin("permission", (join) =>
              join.onRef("rolePermission.permissionId", "=", "permission.id")
            )
            .select(["permission.id", "permission.type", "permission.resource"])
        ).as("permissions"),
      ])
      .executeTakeFirst();

    if (!account) {
      return null;
    }

    const { roleId, role } = account;

    if (!roleId || !role) {
      throw new Error(
        `Could not find corresponding role for the Account with id: ${id}`
      );
    }

    return this.mapToEntity({
      ...account,
      roleId,
      role,
    });
  }
}
