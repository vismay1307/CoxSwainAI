import { Badge } from "@/components/ui/Badge";

type IssueItemProps = {
  issue: {
    id: string;
    title: string;
    status: string;
    owner: string;
  };
};

export default function IssueItem({
  issue,
}: IssueItemProps) {
  return (
    <div className="rounded-[1.25rem] border border-white/80 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {issue.id} {issue.title}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Owner: {issue.owner}</p>
        </div>
        <Badge variant={issue.status === "Review" ? "warning" : issue.status === "In progress" ? "primary" : "outline"}>
          {issue.status}
        </Badge>
      </div>
    </div>
  );
}
