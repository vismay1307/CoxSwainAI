import { z } from "zod";

import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";

import { listRepos } from "@/lib/github/listRepos";
import { listIssues } from "@/lib/github/listIssues";
import { listPullRequests } from "@/lib/github/listPullRequests";
import { listCommits } from "@/lib/github/listCommits";

export const githubRouter =
  createTRPCRouter({
    repos:
  protectedProcedure
    .query(async ({ ctx }) => {
      return listRepos(
        ctx.userId
      );
    }),

    issues:
      protectedProcedure
        .input(
          z.object({
            owner: z.string(),
            repo: z.string(),
          })
        )
        .query(async ({ input,ctx }) => {
          return listIssues(
  ctx.userId,
  input.owner,
  input.repo
);
        }),

    pullRequests:
      protectedProcedure
        .input(
          z.object({
            owner: z.string(),
            repo: z.string(),
          })
        )
        .query(async ({ input,ctx }) => {
          return listPullRequests(
  ctx.userId,
  input.owner,
  input.repo
);
        }),

    commits:
      protectedProcedure
        .input(
          z.object({
            owner: z.string(),
            repo: z.string(),
          })
        )
        .query(async ({ input ,ctx}) => {
          return listCommits(
            ctx.userId,
            input.owner,
            input.repo
          );
        }),
  });