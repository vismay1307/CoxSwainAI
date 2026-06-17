import { Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";

type MeetingPreparationCardProps = {
  title: string;
  summary: string;
  participants: string[];
  agenda: string[];
};

export default function MeetingPreparationCard({
  title,
  summary,
  participants,
  agenda,
}: MeetingPreparationCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="space-y-4 p-5">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>
        <div className="rounded-2xl bg-secondary/70 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="size-4 text-primary" />
            Participants
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{participants.join(", ")}</p>
        </div>
        <div className="rounded-2xl bg-secondary/70 p-4">
          <p className="text-sm font-medium">Suggested agenda</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            {agenda.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
