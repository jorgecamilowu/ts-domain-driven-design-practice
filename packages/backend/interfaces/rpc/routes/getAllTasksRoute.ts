import type { GetAllTasks } from "../../../domain/taskManagement/useCases/GetAllTasks";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { PermissionType } from "../../../domain/auth/valueObjects/PermissionType";
import { Resource } from "../../../domain/auth/valueObjects/Resource";

export const getAllTasksRoute = ({
  GetResourceAccessLevel,
  GetAllTasks,
}: {
  GetResourceAccessLevel: GetResourceAccessLevel;
  GetAllTasks: GetAllTasks;
}) =>
  protectedProcedure.query(async ({ ctx }) => {
    const accessLevel = await GetResourceAccessLevel.execute(
      ctx.account.role,
      new Resource(ctx.account.id, "task")
    );

    if (
      accessLevel !== PermissionType.READ_AND_WRITE &&
      accessLevel !== PermissionType.READ
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return GetAllTasks.execute(ctx.account.id);
  });
