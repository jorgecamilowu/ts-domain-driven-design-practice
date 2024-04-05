import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "../interfaces/rpc/router";
import { zodResolveTypes } from "../interfaces/rpc/trpcPlaygroundFix";
import { expressHandler } from "trpc-playground/handlers/express";
import cors from "cors";

const trpcApiEndpoint = "/api/trpc";
const playgroundEndpoint = "/api/trpc-playground";

export const server = express();

server.use(cors());

server.use(
  trpcApiEndpoint,
  trpcExpress.createExpressMiddleware({ router: appRouter })
);

server.use(
  playgroundEndpoint,
  await expressHandler({
    trpcApiEndpoint,
    playgroundEndpoint,
    router: appRouter,
    resolveTypes: zodResolveTypes,
  })
);
