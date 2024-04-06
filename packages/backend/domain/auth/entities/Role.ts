import type { Permission } from "./Permission";

export interface Role {
  readonly id: number;
  name: string;
  permissions: Permission[];
}
