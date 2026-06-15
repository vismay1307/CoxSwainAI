import { z } from "zod";

import { createTRPCRouter } from "../trpc";
import { publicProcedure } from "../trpc";

import { readEmails } from "@/lib/gmail/readEmails";
import { searchEmails } from "@/lib/gmail/searchEmails";
import { sendEmail } from "@/lib/gmail/sendEmail";
import { createDraft } from "@/lib/gmail/createDraft";

export const gmailRouter =
  createTRPCRouter({
    readEmails:
      publicProcedure
        .input(
          z.object({
            maxResults:
              z.number().default(5),
          })
        )
        .query(async ({ input }) => {
          return readEmails(
            input.maxResults
          );
        }),

    searchEmails:
      publicProcedure
        .input(
          z.object({
            query: z.string(),
            maxResults:
              z.number().default(10),
          })
        )
        .query(async ({ input }) => {
          return searchEmails(
            input.query,
            input.maxResults
          );
        }),

    sendEmail:
      publicProcedure
        .input(
          z.object({
            to: z.string(),
            subject: z.string(),
            body: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          return sendEmail(
            input.to,
            input.subject,
            input.body
          );
        }),

    createDraft:
      publicProcedure
        .input(
          z.object({
            to: z.string(),
            subject: z.string(),
            body: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          return createDraft(
            input.to,
            input.subject,
            input.body
          );
        }),
  });