import { nanoid } from "nanoid";
import { PSQLTaskRepository } from "../../domain/taskManagement/repositories/PSQLTaskRepository";
import { CreateTask } from "../../domain/taskManagement/useCases/CreateTask";
import { DeleteTask } from "../../domain/taskManagement/useCases/DeleteTask";
import { GetAllTasks } from "../../domain/taskManagement/useCases/GetAllTasks";
import { GetTaskById } from "../../domain/taskManagement/useCases/GetTaskById";
import { UpdateTask } from "../../domain/taskManagement/useCases/UpdateTask";
import { db } from "../../infrastructure/database";
import { InMemoryIdempotencyStore } from "../../infrastructure/idempotency/InMemoryIdempotencyStore";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { createTaskRoute } from "./createTaskRoute";
import { getAllTasksRoute } from "./getAllTasksRoute";
import { getTaskByIdRoute } from "./getTaskByIdRoute";
import { updateTaskRoute } from "./updateTaskRoute";

const taskRepository = new PSQLTaskRepository(db);
const inMemoryIdempotencyStore = new InMemoryIdempotencyStore({});

export const appRouter = router({
  createTask: createTaskRoute(
    new CreateTask(taskRepository, inMemoryIdempotencyStore)
  ),
  taskList: getAllTasksRoute(new GetAllTasks(taskRepository)),
  taskById: getTaskByIdRoute(new GetTaskById(taskRepository)),
  updateTask: updateTaskRoute(new UpdateTask(taskRepository)),
  deleteTask: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const useCase = new DeleteTask(taskRepository);
      return useCase.execute(input.id);
    }),
});

export type AppRouter = typeof appRouter;
