import { beforeEach, describe, it, expect } from "bun:test";
import { CreateAccount } from "./CreateAccount";
import type { AccountRepository } from "../repositories/AccountRepository";
import { InMemoryAccountRepository } from "../repositories/InMemoryAccountRepository";
import type { NewAccount } from "../entities/AccountTable";
import { BunPasswordHasher } from "../services/BunPasswordHasher";

describe("Create Account Use Case", () => {
  let useCase: CreateAccount;
  let accountRepository: AccountRepository;

  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository(
      {},
      new BunPasswordHasher()
    );
    useCase = new CreateAccount(accountRepository);
  });

  it("creates a new account", async () => {
    const accountPayload: NewAccount = {
      email: "test@email.com",
      name: "TestAccount",
      password: "some-password",
      roleId: 123,
    };

    const id = await useCase.execute(accountPayload);

    const account = await accountRepository.findById(id);

    expect(account).not.toBeNull();

    expect(account?.email).toEqual(accountPayload.email);
    expect(account?.name).toEqual(accountPayload.name);

    // password should be hashed
    expect(account?.password).not.toEqual(accountPayload.password);
  });
});
