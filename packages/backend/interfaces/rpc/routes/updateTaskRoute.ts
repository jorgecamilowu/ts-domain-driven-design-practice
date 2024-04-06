import { z } from "zod";
import type { UpdateTask } from "../../../domain/taskManagement/useCases/UpdateTask";
import { Priority } from "../../../domain/taskManagement/valueObjects/Priority";
import { publicProcedure } from "../trpc";

export const updateTaskRoute = (useCase: UpdateTask) =>
  publicProcedure
    .input(
      z.object({
        id: z.number(),
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
      return useCase.execute(input.id, input.updateWith);
    });
