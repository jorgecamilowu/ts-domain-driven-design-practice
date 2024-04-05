export interface IdempotencyStore {
  get<T>(id: string): Promise<T | undefined>;
  set<T>(id: string, value: T): Promise<void>;
}
