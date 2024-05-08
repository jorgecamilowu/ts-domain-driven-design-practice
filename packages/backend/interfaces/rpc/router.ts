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
import { GetResourceAccessLevel } from "../../domain/auth/useCases/GetResourceAccessLevel";
import { createAccountRoute } from "./routes/createAccountRoute";
import { CreateAccount } from "../../domain/auth/useCases/CreateAccount";
import { PSQLAccountRepository } from "../../domain/auth/repositories/PSQLAccountRepository";
import { BunPasswordHasher } from "../../domain/auth/services/BunPasswordHasher";

const accountRepository = new PSQLAccountRepository(
  db,
  new BunPasswordHasher()
);
const taskRepository = new PSQLTaskRepository(db);
const inMemoryIdempotencyStore = new InMemoryIdempotencyStore({});
const GetResourceAccessLevelUseCase = new GetResourceAccessLevel();

export const appRouter = router({
  createAccount: createAccountRoute({
    CreateAccount: new CreateAccount(
      accountRepository,
      inMemoryIdempotencyStore
    ),
  }),
  createTask: createTaskRoute({
    CreateTask: new CreateTask(taskRepository, inMemoryIdempotencyStore),
    GetResourceAccessLevel: GetResourceAccessLevelUseCase,
  }),
  getAllTasks: getAllTasksRoute({
    GetResourceAccessLevel: GetResourceAccessLevelUseCase,
    GetAllTasks: new GetAllTasks(taskRepository),
  }),
  getTaskById: getTaskByIdRoute({
    GetResourceAccessLevel: GetResourceAccessLevelUseCase,
    GetTaskById: new GetTaskById(taskRepository),
  }),
  updateTask: updateTaskRoute(new UpdateTask(taskRepository)),
  deleteTask: deleteTaskRoute({
    GetResourceAccessLevel: GetResourceAccessLevelUseCase,
    DeleteTask: new DeleteTask(taskRepository),
  }),
});

export type AppRouter = typeof appRouter;
