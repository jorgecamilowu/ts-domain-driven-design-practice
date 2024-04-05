import { z } from "zod";
import { GetTaskById } from "../../../domain/taskManagement/useCases/GetTaskById";
import { publicProcedure } from "../trpc";

export const getTaskByIdRoute = (useCase: GetTaskById) =>
  publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .query(async ({ input }) => {
      return useCase.execute(input.id);
    });
