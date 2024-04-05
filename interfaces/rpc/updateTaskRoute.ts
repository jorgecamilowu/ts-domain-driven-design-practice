import { z } from "zod";
import { UpdateTask } from "../../domain/taskManagement/useCases/UpdateTask";
import { Priority } from "../../domain/taskManagement/valueObjects/Priority";
import { publicProcedure } from "./trpc";

export const updateTaskRoute = (useCase: UpdateTask) =>
  publicProcedure
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
      return useCase.execute(input.id, input.updateWith);
    });
