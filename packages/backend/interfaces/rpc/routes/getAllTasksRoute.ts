import type { GetAllTasks } from "../../../domain/taskManagement/useCases/GetAllTasks";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const getAllTasksRoute = ({
  GetResourceAccessLevel,
  GetAllTasks,
}: {
  GetResourceAccessLevel: GetResourceAccessLevel;
  GetAllTasks: GetAllTasks;
}) =>
  protectedProcedure.query(async ({ ctx }) => {
    const accessLevel = await GetResourceAccessLevel.execute(ctx.account.role, {
      accountId: ctx.account.id,
      name: "task",
    });

    if (accessLevel !== "read" && accessLevel !== "readAndWrite") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return GetAllTasks.execute(ctx.account.id);
  });
