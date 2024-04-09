import { TRPCError, initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { Role } from "../../domain/auth/entities/Role";

export async function createContext({
  req,
}: trpcExpress.CreateExpressContextOptions) {
  if (req.headers.authorization) {
    const jwt = req.headers.authorization.split(" ")[1];

    const role = await Role.fromJWT(jwt);

    return {
      user: {
        role,
      },
    };
  }

  return { user: null };
}

type Context = Awaited<ReturnType<typeof createContext>>;

const trpc = initTRPC.context<Context>().create();

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const protectedProcedure = trpc.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});
