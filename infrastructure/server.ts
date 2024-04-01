import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "../interfaces/rpc/router";
import config from "config";

export const server = createHTTPServer({
  router: appRouter,
});
