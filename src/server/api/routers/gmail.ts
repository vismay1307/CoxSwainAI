import { z } from "zod";

import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { replyToEmail } from "@/lib/gmail/replyToEmail";
import { markEmailRead } from "@/lib/gmail/markEmailRead";
import { starEmail } from "@/lib/gmail/starEmail";
import { readEmails } from "@/lib/gmail/readEmails";
import { searchEmails } from "@/lib/gmail/searchEmails";
import { sendEmail } from "@/lib/gmail/sendEmail";
import { createDraft } from "@/lib/gmail/createDraft";

export const gmailRouter =
  createTRPCRouter({
    readEmails:
      protectedProcedure
        .input(
          z.object({
            maxResults:
              z.number().default(5),
          })
        )
        .query(async ({ input,ctx }) => {
  return readEmails(
  ctx.userId,
    input.maxResults
  );
}),

searchEmails:
  protectedProcedure
    .input(
      z.object({
        query: z.string(),
        maxResults: z.number().default(10),
      })
    )
    .query(async ({ input,ctx }) => {
      return searchEmails(
        ctx.userId,
        input.query,
        input.maxResults
      );
    }),

    sendEmail:
      protectedProcedure
        .input(
          z.object({
            to: z.string(),
            subject: z.string(),
            body: z.string(),
          })
        )
        .mutation(async ({ input, ctx }) => {
  return sendEmail(
    ctx.userId,
    input.to,
    input.subject,
    input.body,
  );
}),

    createDraft:
      protectedProcedure
        .input(
          z.object({
            to: z.string(),
            subject: z.string(),
            body: z.string(),
          })
        )
        .mutation(async ({ input, ctx }) => {
  return createDraft(
    ctx.userId,
    input.to,
    input.subject,
    input.body
  );
}),
        replyEmail:
  protectedProcedure
    .input(
      z.object({
        to: z.string(),
        subject: z.string(),
        body: z.string(),
        threadId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
  return replyToEmail(
    ctx.userId,
    input.to,
    input.subject,
    input.body,
    input.threadId
  );
}),

markRead:
  protectedProcedure
    .input(
      z.object({
        emailId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
  return markEmailRead(
    ctx.userId,
    input.emailId
  );
}),

starEmail:
  protectedProcedure
    .input(
      z.object({
        emailId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
  return starEmail(
    ctx.userId,
    input.emailId
  );
}),
  });