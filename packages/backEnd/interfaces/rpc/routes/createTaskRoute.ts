import { nanoid } from "nanoid";
import { z } from "zod";
import { CreateTask } from "../../../domain/taskManagement/useCases/CreateTask";
import { Priority } from "../../../domain/taskManagement/valueObjects/Priority";
import { publicProcedure } from "../trpc";

export const createTaskRoute = (useCase: CreateTask) =>
  publicProcedure
    .input(
      z.object({
        task: z.object({
          id: z.string().default(nanoid()),
          title: z.string().default(""),
          description: z.string().default(""),
          dueDate: z.string().default(new Date().toDateString()),
          priority: z.nativeEnum(Priority).default(Priority.LOW),
          completed: z.boolean().default(false),
        }),
        idempotencyKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return useCase.execute(input.task, input.idempotencyKey);
    });
