import { z } from "zod";
import type { DeleteTask } from "../../../domain/taskManagement/useCases/DeleteTask";
import type { GetResourceAccessLevel } from "../../../domain/auth/useCases/GetResourceAccessLevel";
import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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

      return DeleteTask.execute(input.id);
    });
