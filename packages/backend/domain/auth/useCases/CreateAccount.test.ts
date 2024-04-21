import { beforeEach, describe, it, expect, spyOn } from "bun:test";
import { CreateAccount } from "./CreateAccount";
import type { AccountRepository } from "../repositories/AccountRepository";
import { InMemoryAccountRepository } from "../repositories/InMemoryAccountRepository";
import type { NewAccount } from "../entities/AccountTable";
import { BunPasswordHasher } from "../services/BunPasswordHasher";
import { InMemoryIdempotencyStore } from "../../../infrastructure/idempotency/InMemoryIdempotencyStore";
import type { IdempotencyStore } from "../../../infrastructure/idempotency/IdempotencyStore";
import { nanoid } from "nanoid";

describe("Create Account Use Case", () => {
  let useCase: CreateAccount;
  let accountRepository: AccountRepository;
  let idempotencyStore: IdempotencyStore;

  beforeEach(() => {
    idempotencyStore = new InMemoryIdempotencyStore({});
    accountRepository = new InMemoryAccountRepository(
      {},
      new BunPasswordHasher()
    );
    useCase = new CreateAccount(accountRepository, idempotencyStore);
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

  it("creates the new account only once", async () => {
    spyOn(accountRepository, "create");

    const accountPayload: NewAccount = {
      email: "test@email.com",
      name: "TestAccount",
      password: "some-password",
      roleId: 123,
    };

    const idempotencyKey = nanoid();

    const id = await useCase.execute(accountPayload, idempotencyKey);
    const secondTime = await useCase.execute(accountPayload, idempotencyKey);

    expect(accountRepository.create).toHaveBeenCalledTimes(1);

    expect(id).toBe(secondTime);

    const firstFind = await accountRepository.findById(id);
    const secondFind = await accountRepository.findById(secondTime);

    expect(firstFind).not.toBeNull();
    expect(secondFind).not.toBeNull();

    expect(firstFind).toMatchObject({ ...secondFind });
  });
});
