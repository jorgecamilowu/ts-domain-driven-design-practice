import type { PasswordHasher } from "./PasswordHasher";

export class BunPasswordHasher implements PasswordHasher {
  hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return Bun.password.verify(password, hash);
  }
}
