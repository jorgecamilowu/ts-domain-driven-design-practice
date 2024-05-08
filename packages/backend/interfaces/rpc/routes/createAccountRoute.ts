import { z } from "zod";
import { publicProcedure } from "../trpc";
import type { CreateAccount } from "../../../domain/auth/useCases/CreateAccount";

export const createAccountRoute = ({
  CreateAccount,
}: {
  CreateAccount: CreateAccount;
}) =>
  publicProcedure
    .input(
      z.object({
        account: z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        idempotencyKey: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await CreateAccount.execute(input.account, input.idempotencyKey);
    });
