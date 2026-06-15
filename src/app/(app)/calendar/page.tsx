import { Plus, Sparkles } from "lucide-react";

import UpcomingEventsList from "@/components/calendar/UpcomingEventsList";
import WeeklyOverview from "@/components/calendar/WeeklyOverview";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { upcomingEvents } from "@/lib/mock-data";

export default function CalendarPage() {
  return (
    <PageContainer className="space-y-6">
      <Card className="overflow-hidden bg-linear-to-br from-white to-blue-50">
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="primary">
              <Sparkles className="mr-1 size-3" />
              Weekly plan
            </Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Protect focus time without losing the plot.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              See what is next, surface conflicts early, and keep the day weighted toward progress instead of meeting sprawl.
            </p>
          </div>
          <Button size="lg">
            <Plus className="size-4" />
            Create event
          </Button>
        </CardContent>
      </Card>

      <WeeklyOverview />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Upcoming events</CardTitle>
          <CardDescription>High-signal schedule cards for the next critical blocks.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingEventsList events={upcomingEvents} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
