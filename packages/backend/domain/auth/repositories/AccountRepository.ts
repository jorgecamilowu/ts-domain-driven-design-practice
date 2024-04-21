import type { Account } from "../entities/Account";
import type { NewAccount } from "../entities/AccountTable";

export interface AccountRepository {
  create(account: NewAccount): Promise<number>;
  findById(id: number): Promise<Account | null>;
}
