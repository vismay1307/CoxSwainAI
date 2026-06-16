"use client";

import { useEffect, useState } from "react";

import { api } from "@/trpc/client";
import RepoCard from "@/components/github/RepoCard";
import IssueItem from "@/components/github/IssueItem";
import PullRequestItem from "@/components/github/PullRequestItem";

import PageContainer from "@/components/layout/PageContainer";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function GithubPage() {
  const {
    data: repos = [],
    isLoading,
    error,
  } = api.github.repos.useQuery();

  const [selectedRepo, setSelectedRepo] =
    useState<any>(null);

  useEffect(() => {
    if (
      repos.length > 0 &&
      !selectedRepo
    ) {
      setSelectedRepo(
        repos[0]
      );
    }
  }, [
    repos,
    selectedRepo,
  ]);

  const owner =
    selectedRepo?.owner
      ?.login ?? "";

  const repoName =
    selectedRepo?.name ?? "";

  const {
    data: issues = [],
  } =
    api.github.issues.useQuery(
      {
        owner,
        repo: repoName,
      },
      {
        enabled:
          !!owner &&
          !!repoName,
      }
    );

  const {
    data: pullRequests = [],
  } =
    api.github.pullRequests.useQuery(
      {
        owner,
        repo: repoName,
      },
      {
        enabled:
          !!owner &&
          !!repoName,
      }
    );
    const {
  data: commits = [],
} =
  api.github.commits.useQuery(
    {
      owner,
      repo: repoName,
    },
    {
      enabled:
        !!owner &&
        !!repoName,
    }
  );

  if (isLoading) {
    return (
      <PageContainer>
        Loading GitHub...
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        Error: {error.message}
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
<Card className="bg-white">
  <CardHeader>
    <CardTitle>
      Recent Commits
    </CardTitle>

    <CardDescription>
      Latest commits from {repoName}
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-3">
    {commits.length === 0 ? (
      <div className="text-sm text-muted-foreground">
        No commits found.
      </div>
    ) : (
      commits
        .slice(0, 10)
        .map((commit: any) => (
          <div
            key={commit.sha}
            className="rounded-xl border p-4"
          >
            <div className="font-medium">
              {
                commit.commit
                  ?.message
              }
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              {
                commit.commit
                  ?.author
                  ?.name
              }
            </div>

            <div className="text-xs text-muted-foreground">
              {new Date(
                commit.commit
                  ?.author
                  ?.date
              ).toLocaleString()}
            </div>
          </div>
        ))
    )}
  </CardContent>
</Card>

      <section className="grid gap-4 xl:grid-cols-3">
        {repos.map(
          (repo: any) => (
            <div
              key={repo.id}
              onClick={() =>
                setSelectedRepo(
                  repo
                )
              }
              className="cursor-pointer"
            >
              <RepoCard
                repo={{
                  id: String(
                    repo.id
                  ),

                  name:
                    repo.name,

                  description:
                    repo.description ??
                    "No description available",

                  visibility:
                    repo.visibility,

                  stars:
                    repo.stargazers_count,

                  prs:
                    pullRequests.length,

                  issues:
                    repo.open_issues_count,

                  updated:
                    new Date(
                      repo.updated_at
                    ).toLocaleDateString(),
                }}
              />
            </div>
          )
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>
              Issues
            </CardTitle>

            <CardDescription>
              Real GitHub issues for{" "}
              {repoName}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {issues.length ===
            0 ? (
              <div className="text-sm text-muted-foreground">
                No issues found.
              </div>
            ) : (
              issues
                .slice(0, 10)
                .map(
                  (
                    issue: any
                  ) => (
                    <IssueItem
                      key={
                        issue.id
                      }
                      issue={{
                        id: `#${issue.number}`,

                        title:
                          issue.title,

                        owner:
                          issue.user
                            ?.login ??
                          "Unknown",

                        status:
                          issue.state,
                      }}
                    />
                  )
                )
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>
              Pull Requests
            </CardTitle>

            <CardDescription>
              Real pull requests for{" "}
              {repoName}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {pullRequests.length ===
            0 ? (
              <div className="text-sm text-muted-foreground">
                No pull requests found.
              </div>
            ) : (
              pullRequests
                .slice(0, 10)
                .map(
                  (
                    pr: any
                  ) => (
                    <PullRequestItem
                      key={
                        pr.id
                      }
                      pullRequest={{
                        id: `#${pr.number}`,

                        title:
                          pr.title,

                        author:
                          pr.user
                            ?.login ??
                          "Unknown",

                        state:
                          pr.state,
                      }}
                    />
                  )
                )
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>
            Selected Repository
          </CardTitle>

          <CardDescription>
            Current repository
            details
          </CardDescription>
        </CardHeader>

        <CardContent>
          {selectedRepo ? (
            <div className="space-y-2">
              <div>
                <strong>
                  Name:
                </strong>{" "}
                {
                  selectedRepo.name
                }
              </div>

              <div>
                <strong>
                  Owner:
                </strong>{" "}
                {
                  selectedRepo
                    .owner
                    ?.login
                }
              </div>

              <div>
                <strong>
                  Language:
                </strong>{" "}
                {
                  selectedRepo.language
                }
              </div>

              <div>
                <strong>
                  Stars:
                </strong>{" "}
                {
                  selectedRepo.stargazers_count
                }
              </div>
            </div>
          ) : (
            <div>
              No repository
              selected.
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}