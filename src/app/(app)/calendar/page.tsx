"use client";

import { Plus, Sparkles } from "lucide-react";

import AgendaOverview from "@/components/calendar/AgendaOverview";
import MeetingPreparationCard from "@/components/calendar/MeetingPreparationCard";
import UpcomingEventsList from "@/components/calendar/UpcomingEventsList";
import WeeklyOverview from "@/components/calendar/WeeklyOverview";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { buildCalendarInsights, buildMeetingPreparation, mapCalendarEvents } from "@/lib/command-center";
import { api } from "@/trpc/client";

export default function CalendarPage() {
  const {
    data: rawEvents = [],
    isLoading,
    error,
    refetch,
  } = api.calendar.weekEvents.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <PageContainer>
        <PageSkeleton cards={4} rows={4} />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState description={error.message} onRetry={() => void refetch()} />
      </PageContainer>
    );
  }

  const events = mapCalendarEvents(rawEvents as never[]);
  const insights = buildCalendarInsights(events);
  const upcomingEvents = events.slice(0, 6).map((event) => ({
    id: event.id,
    title: event.title,
    time: event.start.toLocaleString(),
    duration: `${Math.max(0, Math.round((event.end.getTime() - event.start.getTime()) / 60000))} mins`,
    attendees: event.attendees,
    location: event.location,
    type: event.attendees.length === 0 ? "focus" : event.title.toLowerCase().includes("review") ? "review" : "meeting",
  }));

  const overviewItems = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
    const matchingEvents = events.filter(
      (event) =>
        event.start.toLocaleDateString("en-US", {
          weekday: "short",
        }) === day
    );

    const totalMinutes = matchingEvents.reduce(
      (sum, event) => sum + Math.max(0, Math.round((event.end.getTime() - event.start.getTime()) / 60000)),
      0
    );

    return {
      day,
      focus: matchingEvents[0]?.title ?? "No major meeting",
      meetings: matchingEvents.length,
      freeHours: Number(Math.max(0, 8 - totalMinutes / 60).toFixed(1)),
    };
  });

  if (events.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          icon={Plus}
          title="No meetings scheduled"
          description="Your Google Calendar is connected, but there are no visible events for this week yet."
          action={<Button onClick={() => void refetch()}>Refresh calendar</Button>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <Card className="overflow-hidden bg-linear-to-br from-white to-blue-50">
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="primary">
              <Sparkles className="mr-1 size-3" />
              Agenda dashboard
            </Badge>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Protect focus time without losing the plot.</h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Live schedule intelligence across today's meetings, free blocks, and weekly meeting pressure.
            </p>
          </div>

          <Button size="lg">
            <Plus className="size-4" />
            Create event
          </Button>
        </CardContent>
      </Card>

      <AgendaOverview
        todayMeetings={insights.todayMeetings}
        weeklyMeetingCount={insights.weeklyMeetingCount}
        focusHours={insights.focusHours}
        busiestDay={insights.busiestDay}
        longestMeetingMinutes={insights.longestMeetingMinutes}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <WeeklyOverview items={overviewItems} />

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Free time blocks</CardTitle>
            <CardDescription>Best windows for scheduling or deep work today.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.freeBlocks.length === 0 ? (
              <div className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
                No 30-minute free blocks available today.
              </div>
            ) : (
              insights.freeBlocks.map((block) => (
                <div key={block.label} className="rounded-2xl bg-secondary/70 px-4 py-3">
                  <p className="text-sm font-medium">{block.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{block.minutes} minutes available</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Upcoming events</CardTitle>
          <CardDescription>Real Google Calendar events from Corsair.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingEventsList events={upcomingEvents} />
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Meeting preparation</CardTitle>
          <CardDescription>Generated participant and agenda guidance for upcoming meetings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-3">
          {events.slice(0, 3).map((event) => {
            const prep = buildMeetingPreparation(event);

            return (
              <MeetingPreparationCard
                key={event.id}
                title={event.title}
                summary={prep.summary}
                participants={prep.participants}
                agenda={prep.agenda}
              />
            );
          })}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
