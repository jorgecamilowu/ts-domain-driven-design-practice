import { z } from "zod";
import type { CreateTask } from "../../../domain/taskManagement/useCases/CreateTask";
import { Priority } from "../../../domain/taskManagement/valueObjects/Priority";
import { protectedProcedure } from "../trpc";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { TRPCError } from "@trpc/server";
import { Resource } from "../../../domain/auth/valueObjects/Resource";
import { PermissionType } from "../../../domain/auth/valueObjects/PermissionType";

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
      let accessLevel: PermissionType = PermissionType.NO_ACCESS;

      if (ctx.account.role !== null) {
        accessLevel = await GetResourceAccessLevel.execute(
          ctx.account.role,
          new Resource(ctx.account.id, "task")
        );
      }

      if (
        accessLevel !== PermissionType.READ_AND_WRITE &&
        accessLevel !== PermissionType.WRITE
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return CreateTask.execute(
        { ...input.task, accountId: ctx.account.id },
        input.idempotencyKey
      );
    });
