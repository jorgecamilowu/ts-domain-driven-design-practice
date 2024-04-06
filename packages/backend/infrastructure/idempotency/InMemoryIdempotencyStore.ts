import type { IdempotencyStore } from "./IdempotencyStore";

export class InMemoryIdempotencyStore implements IdempotencyStore {
  // biome-ignore lint:
  constructor(private store: Record<string, any>) {}

  async get<T>(id: string): Promise<T | undefined> {
    return this.store[id];
  }

  async set<T>(id: string, value: T): Promise<void> {
    this.store[id] = value;
  }
}
