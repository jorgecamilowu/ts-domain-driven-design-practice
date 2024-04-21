import { Account } from "../entities/Account";
import type { NewAccount } from "../entities/AccountTable";
import { Role } from "../entities/Role";
import type { PasswordHasher } from "../services/PasswordHasher";
import type { AccountRepository } from "./AccountRepository";

export class InMemoryAccountRepository implements AccountRepository {
  private count = 0;

  constructor(
    private accounts: Record<number, Account>,
    private passwordHasher: PasswordHasher
  ) {}

  async create({ email, name, password, roleId }: NewAccount): Promise<number> {
    const hashedPassword = await this.passwordHasher.hashPassword(password);

    const newAccount = new Account(
      this.count,
      name,
      email,
      hashedPassword,
      new Role(roleId, "test-role", [])
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
