import { z } from "zod";

import { createTRPCRouter } from "../trpc";

import { protectedProcedure } from "../trpc";
import { getWeekEvents } from "@/lib/calendar/getWeekEvents";
import { createEvent } from "@/lib/calendar/createEvent";
import { updateEvent } from "@/lib/calendar/updateEvent";
import { deleteEvent } from "@/lib/calendar/deleteEvent";

export const calendarRouter =
  createTRPCRouter({
    weekEvents:
      protectedProcedure.query(
        async ({ ctx }) => {
          return getWeekEvents(
            ctx.userId
          );
        }
      ),

    createEvent:
      protectedProcedure
        .input(
          z.object({
            title: z.string(),
            start: z.string(),
            end: z.string(),
          })
        )
        .mutation(
          async ({ input, ctx }) => {
            return createEvent(
              ctx.userId,
              input.title,
              input.start,
              input.end
            );
          }
        ),

    updateEvent:
      protectedProcedure
        .input(
          z.object({
            eventId: z.string(),
            title: z.string(),
            start: z.string(),
            end: z.string(),
          })
        )
        .mutation(
          async ({ input, ctx }) => {
            return updateEvent(
              ctx.userId,
              input.eventId,
              input.title,
              input.start,
              input.end
            );
          }
        ),

    deleteEvent:
      protectedProcedure
        .input(
          z.object({
            eventId: z.string(),
          })
        )
        .mutation(
          async ({ input, ctx }) => {
            return deleteEvent(
              ctx.userId,
              input.eventId
            );
          }
        ),
  });