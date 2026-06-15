import { GitPullRequestArrow, Shield, Star } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { RepoRecord } from "@/lib/mock-data";

type RepoCardProps = {
  repo: RepoRecord;
};

export default function RepoCard({
  repo,
}: RepoCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{repo.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{repo.description}</p>
          </div>
          <Badge variant="outline">{repo.visibility}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl bg-secondary/70 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="size-4" />
              Stars
            </div>
            <p className="mt-2 text-lg font-semibold">{repo.stars}</p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitPullRequestArrow className="size-4" />
              PRs
            </div>
            <p className="mt-2 text-lg font-semibold">{repo.prs}</p>
          </div>
          <div className="rounded-2xl bg-secondary/70 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="size-4" />
              Issues
            </div>
            <p className="mt-2 text-lg font-semibold">{repo.issues}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Updated {repo.updated}</p>
      </CardContent>
    </Card>
  );
}
