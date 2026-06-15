import { publicProcedure } from "../trpc";
import { createTRPCRouter } from "../trpc";

export const healthRouter =
  createTRPCRouter({
    hello:
      publicProcedure.query(() => {
        return {
          message:
            "tRPC working",
        };
      }),
  });