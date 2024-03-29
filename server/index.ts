import { publicProcedure, router } from "./trpc";

const appRouter = router({
  taskList: publicProcedure.query(async () => {
    return [];
  }),
});

export type AppRouter = typeof appRouter;
