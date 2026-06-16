import { createTRPCRouter } from "./trpc";
import { healthRouter } from "./routers/health";
import { calendarRouter } from "./routers/calendar";
import { gmailRouter } from "./routers/gmail";
import { githubRouter } from "./routers/github";
export const appRouter =
  createTRPCRouter({
    health: healthRouter,
    calendar: calendarRouter,
    gmail: gmailRouter,
    github:githubRouter,
  });

export type AppRouter =
  typeof appRouter;