import { GitPullRequestArrow } from "lucide-react";

import { Badge } from "@/components/ui/Badge";

type PullRequestItemProps = {
  pullRequest: {
    id: string;
    title: string;
    author: string;
    state: string;
  };
};

export default function PullRequestItem({
  pullRequest,
}: PullRequestItemProps) {
  return (
    <div className="rounded-[1.25rem] border border-white/80 bg-white p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GitPullRequestArrow className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{pullRequest.id}</p>
              <p className="mt-1 text-sm text-foreground">{pullRequest.title}</p>
            </div>
            <Badge variant={pullRequest.state === "Ready to merge" ? "success" : "outline"}>
              {pullRequest.state}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Author: {pullRequest.author}</p>
        </div>
      </div>
    </div>
  );
}
