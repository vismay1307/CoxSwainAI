import { CalendarClock, Clock3, Flame, TimerReset } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import { formatMinutes } from "@/lib/command-center";

type AgendaOverviewProps = {
  todayMeetings: number;
  weeklyMeetingCount: number;
  focusHours: number;
  busiestDay: string;
  longestMeetingMinutes: number;
};

export default function AgendaOverview({
  todayMeetings,
  weeklyMeetingCount,
  focusHours,
  busiestDay,
  longestMeetingMinutes,
}: AgendaOverviewProps) {
  const stats = [
    {
      label: "Today's meetings",
      value: String(todayMeetings),
      icon: CalendarClock,
    },
    {
      label: "Meetings this week",
      value: String(weeklyMeetingCount),
      icon: Clock3,
    },
    {
      label: "Focus hours",
      value: `${focusHours}h`,
      icon: TimerReset,
    },
    {
      label: "Longest meeting",
      value: formatMinutes(longestMeetingMinutes),
      icon: Flame,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <stat.icon className="size-4" />
              </span>
              <span className="text-sm">{stat.label}</span>
            </div>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            {stat.label === "Meetings this week" ? (
              <p className="mt-2 text-sm text-muted-foreground">Busiest day: {busiestDay}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
