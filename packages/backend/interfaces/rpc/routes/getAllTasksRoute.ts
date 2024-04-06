import type { GetAllTasks } from "../../../domain/taskManagement/useCases/GetAllTasks";
import { publicProcedure } from "../trpc";

export const getAllTasksRoute = (useCase: GetAllTasks) =>
  publicProcedure.query(async () => {
    return useCase.execute();
  });
