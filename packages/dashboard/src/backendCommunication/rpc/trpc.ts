import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "backend/interfaces/rpc/router";

export const trpc = createTRPCReact<AppRouter>();
