import { z } from "zod";
import type { CreateTask } from "../../../domain/taskManagement/useCases/CreateTask";
import { Priority } from "../../../domain/taskManagement/valueObjects/Priority";
import { protectedProcedure } from "../trpc";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { TRPCError } from "@trpc/server";

export const createTaskRoute = ({
  GetResourceAccessLevel,
  CreateTask,
}: {
  GetResourceAccessLevel: GetResourceAccessLevel;
  CreateTask: CreateTask;
}) =>
  protectedProcedure
    .input(
      z.object({
        task: z.object({
          title: z.string().default(""),
          description: z.string().default(""),
          dueDate: z.string().default(new Date().toDateString()),
          priority: z.nativeEnum(Priority).default(Priority.LOW),
          completed: z.boolean().default(false),
        }),
        idempotencyKey: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const accessLevel = await GetResourceAccessLevel.execute(
        ctx.account.role,
        {
          accountId: ctx.account.id,
          name: "task",
        }
      );

      if (accessLevel !== "readAndWrite" && accessLevel !== "write") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return CreateTask.execute(
        { ...input.task, accountId: ctx.account.id },
        input.idempotencyKey
      );
    });
