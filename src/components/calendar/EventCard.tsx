import { Clock3, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { EventRecord } from "@/lib/mock-data";

const toneMap = {
  focus: "success",
  meeting: "primary",
  review: "warning",
} as const;

type EventCardProps = {
  event: EventRecord;
};

export default function EventCard({
  event,
}: EventCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{event.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{event.time}</p>
          </div>
          <Badge variant={toneMap[event.type]}>{event.type}</Badge>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock3 className="size-4" />
            {event.duration}
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            {event.attendees.join(", ")}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />
            {event.location}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
