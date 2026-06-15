import { createTRPCRouter } from "./trpc";
import { healthRouter } from "./routers/health";
import { calendarRouter } from "./routers/calendar";
import { gmailRouter } from "./routers/gmail";
export const appRouter =
  createTRPCRouter({
    health: healthRouter,
    calendar: calendarRouter,
    gmail: gmailRouter,
  });

export type AppRouter =
  typeof appRouter;