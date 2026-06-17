"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import GithubActivityFeed from "@/components/github/GithubActivityFeed";
import GithubQuickActions from "@/components/github/GithubQuickActions";
import IssueItem from "@/components/github/IssueItem";
import PullRequestItem from "@/components/github/PullRequestItem";
import RepoCard from "@/components/github/RepoCard";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { buildGithubActivityFeed, buildGithubDigest } from "@/lib/command-center";
import { api } from "@/trpc/client";

export default function GithubPage() {
  const {
    data: repos = [],
    isLoading,
    error,
    refetch,
  } = api.github.repos.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  useEffect(() => {
    if (repos.length > 0 && !selectedRepo) {
      setSelectedRepo(repos[0]);
    }
  }, [repos, selectedRepo]);

  const owner = selectedRepo?.owner?.login ?? "";
  const repoName = selectedRepo?.name ?? "";

  const { data: issues = [] } = api.github.issues.useQuery(
    {
      owner,
      repo: repoName,
    },
    {
      enabled: !!owner && !!repoName,
    }
  );

  const { data: pullRequests = [] } = api.github.pullRequests.useQuery(
    {
      owner,
      repo: repoName,
    },
    {
      enabled: !!owner && !!repoName,
    }
  );

  const { data: commits = [] } = api.github.commits.useQuery(
    {
      owner,
      repo: repoName,
    },
    {
      enabled: !!owner && !!repoName,
    }
  );

  const digest = useMemo(
    () => buildGithubDigest(repos as never[], issues as never[], pullRequests as never[], commits as never[]),
    [commits, issues, pullRequests, repos]
  );

  const activityFeed = useMemo(
    () => buildGithubActivityFeed(issues as never[], pullRequests as never[], commits as never[]).slice(0, 12),
    [commits, issues, pullRequests]
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PageSkeleton cards={3} rows={5} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState description={error.message} onRetry={() => void refetch()} />
      </PageContainer>
    );
  }

  if (!repos.length) {
    return (
      <PageContainer>
        <EmptyState
          icon={Sparkles}
          title="No repositories connected"
          description="Your GitHub integration is available, but there are no repositories visible yet."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Engineering digest</Badge>
            <Badge variant="outline">{repos.length} repositories</Badge>
            <Badge variant="outline">{digest.openPullRequests} pull requests</Badge>
          </div>
          <CardTitle className="mt-2">GitHub operations board</CardTitle>
          <CardDescription>Real repository, issue, pull request, and commit data from the existing integration.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[1.75rem] bg-secondary/70 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Digest summary</p>
            <p className="mt-3 text-sm leading-7">{digest.summary}</p>
          </div>
          <div className="rounded-[1.75rem] bg-secondary/70 p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Blocked work</p>
            <div className="mt-3 space-y-2 text-sm leading-6">
              {digest.blockedWork.length > 0 ? (
                digest.blockedWork.map((item) => <p key={item}>{item}</p>)
              ) : (
                <p className="text-muted-foreground">No blocked work detected from the current sample.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        {repos.map((repo: any) => (
          <div key={repo.id} onClick={() => setSelectedRepo(repo)} className="cursor-pointer">
            <RepoCard
              repo={{
                id: String(repo.id),
                name: repo.name,
                description: repo.description ?? "No description available",
                visibility: repo.visibility,
                stars: repo.stargazers_count,
                prs: selectedRepo?.id === repo.id ? pullRequests.length : 0,
                issues: repo.open_issues_count,
                updated: new Date(repo.updated_at).toLocaleDateString(),
              }}
            />
          </div>
        ))}
      </section>

      <GithubQuickActions owner={owner} repoName={repoName} />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Issues</CardTitle>
            <CardDescription>Open issues for {repoName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? (
              <div className="text-sm text-muted-foreground">No issues found.</div>
            ) : (
              issues.slice(0, 10).map((issue: any) => (
                <IssueItem
                  key={issue.id}
                  issue={{
                    id: `#${issue.number}`,
                    title: issue.title,
                    owner: issue.user?.login ?? "Unknown",
                    status: issue.state,
                  }}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Pull requests</CardTitle>
            <CardDescription>Open PRs for {repoName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pullRequests.length === 0 ? (
              <div className="text-sm text-muted-foreground">No pull requests found.</div>
            ) : (
              pullRequests.slice(0, 10).map((pr: any) => (
                <PullRequestItem
                  key={pr.id}
                  pullRequest={{
                    id: `#${pr.number}`,
                    title: pr.title,
                    author: pr.user?.login ?? "Unknown",
                    state: pr.state,
                  }}
                />
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent commits</CardTitle>
            <CardDescription>Latest engineering changes in {repoName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {commits.length === 0 ? (
              <div className="text-sm text-muted-foreground">No commits found.</div>
            ) : (
              commits.slice(0, 8).map((commit: any) => (
                <div key={commit.sha} className="rounded-2xl bg-secondary/70 p-4">
                  <p className="text-sm font-medium">{commit.commit?.message}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{commit.commit?.author?.name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    {commit.commit?.author?.date ? new Date(commit.commit.author.date).toLocaleString() : "Unknown time"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Activity feed</CardTitle>
            <CardDescription>Unified feed of commits, issues, and pull requests sorted by recency.</CardDescription>
          </CardHeader>
          <CardContent>
            <GithubActivityFeed items={activityFeed} />
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
