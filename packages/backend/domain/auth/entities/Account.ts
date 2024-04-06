import type { Role } from "./Role";

export interface Account {
  readonly id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
