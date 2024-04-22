import { Account } from "../entities/Account";
import type { NewAccount } from "../entities/AccountTable";
import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";
import type { PasswordHasher } from "../services/PasswordHasher";
import { PermissionType } from "../valueObjects/PermissionType";
import { Resource } from "../valueObjects/Resource";
import type { AccountRepository } from "./AccountRepository";

export class InMemoryAccountRepository implements AccountRepository {
  private count = 0;

  constructor(
    private accounts: Record<number, Account>,
    private passwordHasher: PasswordHasher
  ) {}

  async create({ email, name, password }: NewAccount): Promise<number> {
    const hashedPassword = await this.passwordHasher.hashPassword(password);

    const role = new Role(Math.floor(Math.random() * 10), "test-role", [
      new Permission(
        this.count,
        PermissionType.READ_AND_WRITE,
        new Resource(this.count, "task")
      ),
    ]);

    const newAccount = new Account(
      this.count,
      name,
      email,
      hashedPassword,
      role
    );

    this.count++;

    this.accounts[newAccount.id] = newAccount;

    return newAccount.id;
  }
  async findById(id: number): Promise<Account | null> {
    const account = this.accounts[id];

    return account || null;
  }
}
