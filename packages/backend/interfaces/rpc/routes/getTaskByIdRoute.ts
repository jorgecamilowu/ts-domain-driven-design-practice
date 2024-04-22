import { z } from "zod";
import type { GetTaskById } from "../../../domain/taskManagement/useCases/GetTaskById";
import { protectedProcedure } from "../trpc";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { TRPCError } from "@trpc/server";
import { PermissionType } from "../../../domain/auth/valueObjects/PermissionType";
import { Resource } from "../../../domain/auth/valueObjects/Resource";

export const getTaskByIdRoute = ({
  GetResourceAccessLevel,
  GetTaskById,
}: {
  GetResourceAccessLevel: GetResourceAccessLevel;
  GetTaskById: GetTaskById;
}) =>
  protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const task = await GetTaskById.execute(input.id);

      if (task === null || task.accountId === null) {
        return null;
      }

      let accessLevel: PermissionType = PermissionType.NO_ACCESS;

      if (ctx.account.role !== null) {
        accessLevel = await GetResourceAccessLevel.execute(
          ctx.account.role,
          new Resource(task.accountId, "task")
        );
      }

      if (
        accessLevel !== PermissionType.READ_AND_WRITE &&
        accessLevel !== PermissionType.READ
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return task;
    });
