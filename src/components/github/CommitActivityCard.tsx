import { Card, CardContent } from "@/components/ui/Card";

type CommitActivityCardProps = {
  activity: {
    label: string;
    commits: number;
  };
};

export default function CommitActivityCard({
  activity,
}: CommitActivityCardProps) {
  const widthClass =
    activity.commits >= 18
      ? "w-[92%]"
      : activity.commits >= 14
        ? "w-[74%]"
        : activity.commits >= 12
          ? "w-[60%]"
          : "w-[48%]";

  return (
    <Card className="bg-white">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold">{activity.label}</p>
            <p className="text-sm text-muted-foreground">Commit velocity</p>
          </div>
          <p className="text-3xl font-semibold">{activity.commits}</p>
        </div>
        <div className="h-2 rounded-full bg-secondary">
          <div className={`h-2 rounded-full bg-primary ${widthClass}`} />
        </div>
      </CardContent>
    </Card>
  );
}
