import { z } from "zod";
import type { DeleteTask } from "../../../domain/taskManagement/useCases/DeleteTask";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PermissionType } from "../../../domain/auth/valueObjects/PermissionType";
import { Resource } from "../../../domain/auth/valueObjects/Resource";

export const deleteTaskRoute = ({
  GetResourceAccessLevel,
  DeleteTask,
}: {
  GetResourceAccessLevel: GetResourceAccessLevel;
  DeleteTask: DeleteTask;
}) =>
  protectedProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const accessLevel = await GetResourceAccessLevel.execute(
        ctx.account.role,
        new Resource(ctx.account.id, "task")
      );
      if (
        accessLevel !== PermissionType.READ_AND_WRITE &&
        accessLevel !== PermissionType.WRITE
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return DeleteTask.execute(input.id);
    });
