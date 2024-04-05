import { PSQLTaskRepository } from "../../domain/taskManagement/repositories/PSQLTaskRepository";
import { CreateTask } from "../../domain/taskManagement/useCases/CreateTask";
import { DeleteTask } from "../../domain/taskManagement/useCases/DeleteTask";
import { GetAllTasks } from "../../domain/taskManagement/useCases/GetAllTasks";
import { GetTaskById } from "../../domain/taskManagement/useCases/GetTaskById";
import { UpdateTask } from "../../domain/taskManagement/useCases/UpdateTask";
import { db } from "../../infrastructure/database/database";
import { InMemoryIdempotencyStore } from "../../infrastructure/idempotency/InMemoryIdempotencyStore";
import { router } from "./trpc";
import { createTaskRoute } from "./routes/createTaskRoute";
import { getAllTasksRoute } from "./routes/getAllTasksRoute";
import { getTaskByIdRoute } from "./routes/getTaskByIdRoute";
import { updateTaskRoute } from "./routes/updateTaskRoute";
import { deleteTaskRoute } from "./routes/deleteTaskRoute";

const taskRepository = new PSQLTaskRepository(db);
const inMemoryIdempotencyStore = new InMemoryIdempotencyStore({});

export const appRouter = router({
  createTask: createTaskRoute(
    new CreateTask(taskRepository, inMemoryIdempotencyStore)
  ),
  taskList: getAllTasksRoute(new GetAllTasks(taskRepository)),
  taskById: getTaskByIdRoute(new GetTaskById(taskRepository)),
  updateTask: updateTaskRoute(new UpdateTask(taskRepository)),
  deleteTask: deleteTaskRoute(new DeleteTask(taskRepository)),
});

export type AppRouter = typeof appRouter;
