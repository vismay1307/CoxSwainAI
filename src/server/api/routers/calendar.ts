import { z } from "zod";

import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";

import { getWeekEvents } from "@/lib/calendar/getWeekEvents";
import { createEvent } from "@/lib/calendar/createEvent";
import { updateEvent } from "@/lib/calendar/updateEvent";
import { deleteEvent } from "@/lib/calendar/deleteEvent";

export const calendarRouter =
  createTRPCRouter({
    weekEvents:
      publicProcedure.query(async () => {
        return getWeekEvents("default");
      }),

    createEvent:
      publicProcedure
        .input(
          z.object({
            title: z.string(),
            start: z.string(),
            end: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          return createEvent(
            input.title,
            input.start,
            input.end
          );
        }),

    updateEvent:
      publicProcedure
        .input(
          z.object({
            eventId: z.string(),
            title: z.string(),
            start: z.string(),
            end: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          return updateEvent(
            input.eventId,
            input.title,
            input.start,
            input.end
          );
        }),

    deleteEvent:
      publicProcedure
        .input(
          z.object({
            eventId: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          return deleteEvent(
            input.eventId
          );
        }),
  });