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
  dueDate: ColumnType<Date, string | undefined, Date>;
  priority: Priority;
  completed: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type TaskResult = Selectable<TaskTable>;
export type NewTask = Insertable<TaskTable>;
export type TaskUpdate = Updateable<TaskTable>;
