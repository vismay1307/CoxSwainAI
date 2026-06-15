import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import superjson from "superjson";

export async function createTRPCContext() {
  const { userId } = await auth();

  return {
    userId,
  };
}

const t = initTRPC
  .context<Awaited<ReturnType<
    typeof createTRPCContext
  >>>()
  .create({
    transformer: superjson,
  });

export const createTRPCRouter =
  t.router;

export const publicProcedure =
  t.procedure;

export const protectedProcedure =
  t.procedure.use(
    async ({ ctx, next }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      return next({
        ctx: {
          ...ctx,
          userId: ctx.userId,
        },
      });
    }
  );