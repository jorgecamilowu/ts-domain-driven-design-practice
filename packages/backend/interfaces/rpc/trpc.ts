import { TRPCError, initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { Account } from "../../domain/auth/entities/Account";

export async function createContext({
  req,
}: trpcExpress.CreateExpressContextOptions) {
  if (req.headers.authorization) {
    const jwt = req.headers.authorization.split(" ")[1];

    const accountInfo = await Account.parseInfoFromJWT(jwt);

    return {
      account: accountInfo,
    };
  }

  return { account: null, errorMessage: "Missing authorization header" };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(async ({ ctx, next }) => {
  if (!ctx.account || ctx.account.role === null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ctx.errorMessage,
    });
  }

  return next({
    ctx: {
      account: ctx.account,
    },
  });
});
