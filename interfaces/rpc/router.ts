import { nanoid } from "nanoid";
import { PSQLTaskRepository } from "../../domain/taskManagement/repositories/PSQLTaskRepository";
import { CreateTask } from "../../domain/taskManagement/useCases/CreateTask";
import { DeleteTask } from "../../domain/taskManagement/useCases/DeleteTask";
import { GetAllTasks } from "../../domain/taskManagement/useCases/GetAllTasks";
import { GetTaskById } from "../../domain/taskManagement/useCases/GetTaskById";
import { UpdateTask } from "../../domain/taskManagement/useCases/UpdateTask";
import { Priority } from "../../domain/taskManagement/valueObjects/Priority";
import { db } from "../../infrastructure/database";
import { InMemoryIdempotencyStore } from "../../infrastructure/idempotency/InMemoryIdempotencyStore";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { createTaskRoute } from "./createTaskRoute";
import { getAllTasksRoute } from "./getAllTasksRoute";
import { getTaskByIdRoute } from "./getTaskByIdRoute";

const taskRepository = new PSQLTaskRepository(db);
const inMemoryIdempotencyStore = new InMemoryIdempotencyStore({});

export const appRouter = router({
  createTask: createTaskRoute(
    new CreateTask(taskRepository, inMemoryIdempotencyStore)
  ),
  taskList: getAllTasksRoute(new GetAllTasks(taskRepository)),
  taskById: getTaskByIdRoute(new GetTaskById(taskRepository)),
  updateTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
        updateWith: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          dueDate: z.date().optional(),
          priority: z.nativeEnum(Priority).optional(),
          completed: z.boolean().optional(),
          createdAt: z.date().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const useCase = new UpdateTask(taskRepository);

      return useCase.execute(input.id, input.updateWith);
    }),
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
