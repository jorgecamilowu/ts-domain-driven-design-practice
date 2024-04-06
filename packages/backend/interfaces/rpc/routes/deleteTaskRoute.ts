import { z } from "zod";
import type { DeleteTask } from "../../../domain/taskManagement/useCases/DeleteTask";
import { publicProcedure } from "../trpc";

export const deleteTaskRoute = (useCase: DeleteTask) =>
  publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return useCase.execute(input.id);
    });
