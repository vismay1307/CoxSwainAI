import { GitCommitHorizontal, GitPullRequestArrow, ShieldAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  actor: string;
  timestamp: string;
};

type GithubActivityFeedProps = {
  items: ActivityItem[];
};

const iconMap = {
  Commit: GitCommitHorizontal,
  Issue: ShieldAlert,
  "Pull request": GitPullRequestArrow,
} as const;

export default function GithubActivityFeed({
  items,
}: GithubActivityFeedProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = iconMap[item.type as keyof typeof iconMap] ?? GitCommitHorizontal;

        return (
          <Card key={item.id} className="bg-white">
            <CardContent className="flex items-start gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.type} · {item.actor}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Unknown time"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
