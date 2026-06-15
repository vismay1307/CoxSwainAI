import CommitActivityCard from "@/components/github/CommitActivityCard";
import IssueItem from "@/components/github/IssueItem";
import PullRequestItem from "@/components/github/PullRequestItem";
import RepoCard from "@/components/github/RepoCard";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { commitActivity, issues, pullRequests, repositories } from "@/lib/mock-data";

export default function GithubPage() {
  return (
    <PageContainer className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Engineering visibility</Badge>
            <Badge variant="outline">Mock data, frontend only</Badge>
          </div>
          <CardTitle className="mt-2">GitHub operations board</CardTitle>
          <CardDescription>See repository health, active issues, pull requests, and commit momentum in one view.</CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        {repositories.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Issues</CardTitle>
            <CardDescription>Work that still needs a decision, fix, or handoff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} />
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Pull requests</CardTitle>
            <CardDescription>Review state at a glance, without context-switching into GitHub.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pullRequests.map((pullRequest) => (
              <PullRequestItem key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Commit activity</CardTitle>
          <CardDescription>Daily throughput snapshots across the week.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          {commitActivity.map((activity) => (
            <CommitActivityCard key={activity.label} activity={activity} />
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
