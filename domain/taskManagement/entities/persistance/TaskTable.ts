import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";
import { Priority } from "../../valueObjects/Priority";

export interface TaskTable {
  id: Generated<string>;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  completed: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type TaskResult = Selectable<TaskTable>;
export type NewTask = Insertable<TaskTable>;
export type TaskUpdate = Updateable<TaskTable>;
