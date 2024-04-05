import {
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
  Nullable,
} from "kysely";

export interface AccountTable {
  id: GeneratedAlways<number>;
  name: string;
  email: string;
  password: string;
  roleId: Nullable<number>;
}

export type AccountResult = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;
