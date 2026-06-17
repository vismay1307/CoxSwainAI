"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Plus, Sparkles } from "lucide-react";

import AgendaOverview from "@/components/calendar/AgendaOverview";
import MeetingPreparationCard from "@/components/calendar/MeetingPreparationCard";
import UpcomingEventsList from "@/components/calendar/UpcomingEventsList";
import WeeklyOverview from "@/components/calendar/WeeklyOverview";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import PageSkeleton from "@/components/ui/PageSkeleton";
import { buildCalendarInsights, buildMeetingPreparation, mapCalendarEvents } from "@/lib/command-center";
import { api } from "@/trpc/client";

export default function CalendarPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const {
    data: rawEvents = [],
    isLoading,
    error,
    refetch,
  } = api.calendar.weekEvents.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const events = mapCalendarEvents(rawEvents as never[]);
  const selectedEvent = selectedEventId ? events.find((event) => event.id === selectedEventId) ?? null : null;
  const insights = buildCalendarInsights(events);
  const thisMonthDays = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstWeekday = start.getDay();
    const cells: Array<{ label: string; date: Date | null; events: typeof events }> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ label: "", date: null, events: [] });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      cells.push({
        label: String(day),
        date,
        events: events.filter((event) => event.start.toDateString() === date.toDateString()),
      });
    }

    return cells;
  }, [events]);

  const weekHours = Array.from({ length: 10 }, (_, index) => index + 8);
  const today = new Date();
  const todayEvents = events.filter((event) => event.start.toDateString() === today.toDateString());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowEvents = events.filter((event) => event.start.toDateString() === tomorrow.toDateString());
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

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            Month view
          </CardTitle>
          <CardDescription>Real Google Calendar events placed into the monthly grid.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="px-2 py-1 font-semibold uppercase tracking-[0.2em]">
                {day}
              </div>
            ))}
            {thisMonthDays.map((cell, index) => (
              <button
                key={`${cell.label}-${index}`}
                type="button"
                onClick={() => cell.date && setSelectedEventId(cell.events[0]?.id ?? null)}
                className="min-h-28 rounded-2xl border border-border bg-secondary/30 p-2 text-left transition-colors hover:bg-secondary/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{cell.label}</span>
                  {cell.date && cell.date.toDateString() === new Date().toDateString() ? (
                    <Badge variant="primary">Today</Badge>
                  ) : null}
                </div>
                <div className="mt-2 space-y-1">
                  {cell.events.slice(0, 2).map((event) => (
                    <div key={event.id} className="rounded-xl bg-white px-2 py-1 text-xs text-foreground shadow-sm">
                      {event.title}
                    </div>
                  ))}
                  {cell.events.length > 2 ? (
                    <p className="px-1 text-xs text-muted-foreground">+{cell.events.length - 2} more</p>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Week view</CardTitle>
            <CardDescription>Hourly layout for the current day block.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {weekHours.map((hour) => {
              const hourLabel = `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? "AM" : "PM"}`;
              const hourEvents = todayEvents.filter((event) => event.start.getHours() === hour);

              return (
                <div key={hour} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
                  <div className="pt-2 text-xs font-medium text-muted-foreground">{hourLabel}</div>
                  <div className="rounded-2xl border border-border bg-secondary/30 p-2">
                    {hourEvents.length === 0 ? (
                      <div className="py-3 text-sm text-muted-foreground">Free</div>
                    ) : (
                      hourEvents.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEventId(event.id)}
                          className="mb-2 w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm last:mb-0"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold">{event.title}</p>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{" "}
                            {event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Day view</CardTitle>
            <CardDescription>Timeline for today and tomorrow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Today", items: todayEvents },
              { label: "Tomorrow", items: tomorrowEvents },
            ].map((bucket) => (
              <div key={bucket.label} className="rounded-[1.5rem] bg-secondary/40 p-4">
                <p className="text-sm font-semibold">{bucket.label}</p>
                <div className="mt-3 space-y-2">
                  {bucket.items.length === 0 ? (
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-muted-foreground">No events</div>
                  ) : (
                    bucket.items.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className="w-full rounded-2xl bg-white px-4 py-3 text-left shadow-sm"
                      >
                        <p className="text-sm font-semibold">{event.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} -{" "}
                          {event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && setSelectedEventId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title ?? "Event details"}</DialogTitle>
            <DialogDescription>
              {selectedEvent
                ? `${selectedEvent.start.toLocaleString()} - ${selectedEvent.end.toLocaleString()}`
                : "Select a calendar event"}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent ? (
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl bg-secondary/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                <p className="mt-1">{selectedEvent.location}</p>
              </div>
              <div className="rounded-2xl bg-secondary/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Attendees</p>
                <p className="mt-1">{selectedEvent.attendees.length ? selectedEvent.attendees.join(", ") : "None listed"}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
