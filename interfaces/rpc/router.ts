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

const taskRepository = new PSQLTaskRepository(db);
const inMemoryIdempotencyStore = new InMemoryIdempotencyStore({});

export const appRouter = router({
  createTask: publicProcedure
    .input(
      z.object({
        idempotencyKey: z.string().optional(),
        task: z.object({
          id: z.string().default(nanoid()),
          title: z.string().default(""),
          description: z.string().default(""),
          dueDate: z.string().default(new Date().toDateString()),
          priority: z.nativeEnum(Priority).default(Priority.LOW),
          completed: z.boolean().default(false),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const useCase = new CreateTask(taskRepository, inMemoryIdempotencyStore);

      return useCase.execute(input.task, input.idempotencyKey);
    }),
  taskList: publicProcedure.query(async () => {
    const useCase = new GetAllTasks(taskRepository);

    return useCase.execute();
  }),
  taskById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const useCase = new GetTaskById(taskRepository);

      return useCase.execute(input.id);
    }),
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
