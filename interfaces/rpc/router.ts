import { PSQLTaskRepository } from "../../domain/taskManagement/repositories/PSQLTaskRepository";
import { GetAllTasks } from "../../domain/taskManagement/useCases/GetAllTasks";
import { db } from "../../infrastructure/database";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

const appRouter = router({
  taskList: publicProcedure.query(async () => {
    const useCase = new GetAllTasks(new PSQLTaskRepository(db));

    return useCase.execute();
  }),
});

export type AppRouter = typeof appRouter;
