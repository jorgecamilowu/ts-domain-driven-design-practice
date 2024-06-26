export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
