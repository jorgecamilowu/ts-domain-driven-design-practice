import { PSQLTaskRepository } from "../../domain/taskManagement/repositories/PSQLTaskRepository";
import { GetAllTasks } from "../../domain/taskManagement/useCases/GetAllTasks";
import { GetTaskById } from "../../domain/taskManagement/useCases/GetTaskById";
import { db } from "../../infrastructure/database";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

const appRouter = router({
  taskList: publicProcedure.query(async () => {
    const useCase = new GetAllTasks(new PSQLTaskRepository(db));

    return useCase.execute();
  }),
  taskById: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const useCase = new GetTaskById(new PSQLTaskRepository(db));

      return useCase.execute(input.id);
    }),
});

export type AppRouter = typeof appRouter;
