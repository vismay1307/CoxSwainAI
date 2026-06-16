"use client";

import { Plus, Sparkles } from "lucide-react";

import { api } from "@/trpc/client";

import UpcomingEventsList from "@/components/calendar/UpcomingEventsList";
import WeeklyOverview from "@/components/calendar/WeeklyOverview";
import PageContainer from "@/components/layout/PageContainer";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function CalendarPage() {
  const {
    data: events = [],
    isLoading,
    error,
  } =
    api.calendar.weekEvents.useQuery();

  if (isLoading) {
    return (
      <PageContainer>
        Loading calendar...
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        Error: {error.message}
      </PageContainer>
    );
  }

  const mappedEvents =
    events.map((event: any) => {
      const start =
        event.data?.start?.dateTime ??
        event.data?.start?.date ??
        "";

      const end =
        event.data?.end?.dateTime ??
        event.data?.end?.date ??
        "";

      return {
        id:
          event.entity_id,

        title:
          event.data?.summary ??
          "Untitled Event",

        time: start
          ? new Date(
              start
            ).toLocaleString()
          : "No Time",

        duration:
          start && end
            ? `${Math.round(
                (new Date(
                  end
                ).getTime() -
                  new Date(
                    start
                  ).getTime()) /
                  60000
              )} mins`
            : "Unknown",

        attendees:
          event.data?.attendees?.map(
            (
              attendee: any
            ) =>
              attendee.email
          ) ?? [],

        location:
          event.data?.location ??
          "No Location",

        type:
          "meeting",
      };
    });

  return (
    <PageContainer className="space-y-6">
      <Card className="overflow-hidden bg-linear-to-br from-white to-blue-50">
        <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge variant="primary">
              <Sparkles className="mr-1 size-3" />
              Weekly plan
            </Badge>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Protect focus time
              without losing
              the plot.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              See what is next,
              surface conflicts
              early, and keep
              the day weighted
              toward progress.
            </p>
          </div>

          <Button size="lg">
            <Plus className="size-4" />
            Create Event
          </Button>
        </CardContent>
      </Card>

      <WeeklyOverview />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>
            Upcoming Events
          </CardTitle>

          <CardDescription>
            Real Google Calendar
            events from Corsair.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <UpcomingEventsList
            events={
              mappedEvents
            }
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}