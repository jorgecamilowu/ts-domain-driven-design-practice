import type { IdempotencyStore } from "../../../infrastructure/idempotency/IdempotencyStore";
import type { NewAccount } from "../entities/AccountTable";
import type { AccountRepository } from "../repositories/AccountRepository";

export class CreateAccount {
  constructor(
    private accountRepository: AccountRepository,
    private idempotencyStore: IdempotencyStore
  ) {}
  async execute(account: NewAccount, idempotencyKey?: string): Promise<number> {
    let result: number | undefined;

    if (idempotencyKey !== undefined) {
      result = await this.idempotencyStore.get<number>(idempotencyKey);
    }

    if (result !== undefined) {
      return result;
    }

    const id = await this.accountRepository.create(account);

    if (idempotencyKey) {
      this.idempotencyStore.set(idempotencyKey, id);
    }

    return id;
  }
}
