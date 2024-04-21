import type {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface AccountTable {
  id: GeneratedAlways<number>;
  name: string;
  email: string;
  password: string;
  roleId: number | null;
}

export type AccountResult = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;
