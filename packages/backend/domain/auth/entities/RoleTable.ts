import { GeneratedAlways, Insertable, Selectable, Updateable } from "kysely";

export interface RoleTable {
  id: GeneratedAlways<number>;
  name: string;
}

export type AccountResult = Selectable<RoleTable>;
export type NewAccount = Insertable<RoleTable>;
export type AccountUpdate = Updateable<RoleTable>;
