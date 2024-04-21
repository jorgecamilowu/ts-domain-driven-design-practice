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

export class PSQLAccountRepository implements AccountRepository {
  constructor(private db: Kysely<Database>) {}

  private mapToEntity(account: {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number | null;
    role: {
      name: string;
    } | null;
    permissions: {
      id: number;
      type: PermissionType;
      resource: ResourceString;
    }[];
  }): Account {
    const newAccount = new Account(
      account.id,
      account.name,
      account.email,
      account.password,
      null
    );

    if (account.roleId !== null && account.role !== null) {
      newAccount.role = new Role(
        account.roleId,
        account.role.name,
        account.permissions.map(({ id, resource, type }) => ({
          id,
          type,
          resource: Resource.fromResourceString(resource),
        }))
      );
    }

    return newAccount;
  }

  async create(account: NewAccount): Promise<number> {
    const result = await this.db.transaction().execute(async (trx) => {
      const { id: accountId } = await trx
        .insertInto("account")
        .values(account)
        .returningAll()
        .executeTakeFirstOrThrow();

      if (account.roleId) {
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

        const { id: roleId } = await trx
          .insertInto("role")
          .values({
            name: "DefaultRole",
          })
          .returning("id")
          .executeTakeFirstOrThrow();

        await trx
          .insertInto("rolePermission")
          .values(
            permissionIds.map((permission) => ({
              permissionId: permission.id,
              roleId,
            }))
          )
          .execute();

        await trx
          .updateTable("account")
          .set("account.roleId", roleId)
          .execute();
      }

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

    return this.mapToEntity(account);
  }
}
