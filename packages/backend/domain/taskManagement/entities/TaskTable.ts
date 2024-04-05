import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { Priority } from "../valueObjects/Priority";

export interface TaskTable {
  id: GeneratedAlways<number>;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  dueDate: ColumnType<Date, string | undefined, Date>;
  createdAt: ColumnType<Date, string | undefined, never>;
  accountId: number | null;
}

export type TaskResult = Selectable<TaskTable>;
export type NewTask = Insertable<TaskTable>;
export type TaskUpdate = Updateable<TaskTable>;
