import type { NewAccount } from "../entities/AccountTable";
import type { AccountRepository } from "../repositories/AccountRepository";

export class CreateAccount {
  constructor(private accountRepository: AccountRepository) {}
  async execute(
    account: NewAccount,
    _idempotencyKey?: string
  ): Promise<number> {
    const id = await this.accountRepository.create(account);

    return id;
  }
}
