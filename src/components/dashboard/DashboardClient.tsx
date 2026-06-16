"use client";

import {
  Mail,
  CalendarDays,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { api } from "@/trpc/client";

export default function DashboardClient() {
  const { data: emails = [] } =
    api.gmail.readEmails.useQuery({
      maxResults: 20,
    });

  const { data: events = [] } =
    api.calendar.weekEvents.useQuery();

  const { data: repos = [] } =
    api.github.repos.useQuery();

  const latestEmail =
    emails.length > 0
      ? emails[0]
      : null;

  const nextEvent =
    events.length > 0
      ? events[0]
      : null;

  const latestRepo =
    repos.length > 0
      ? repos[0]
      : null;

  return (
    <div className="space-y-4">
      {/* Top KPI Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Emails
          </p>

          <p className="mt-2 text-4xl font-bold">
            {emails.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            Calendar Events
          </p>

          <p className="mt-2 text-4xl font-bold">
            {events.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <p className="text-sm text-muted-foreground">
            GitHub Repositories
          </p>

          <p className="mt-2 text-4xl font-bold">
            {repos.length}
          </p>
        </div>
      </div>

      {/* AI Command Brief */}
      <div className="rounded-3xl border bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" />
          <p className="font-semibold">
            AI Command Brief
          </p>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-200">
          You currently have{" "}
          <strong>{emails.length}</strong>{" "}
          emails,{" "}
          <strong>{events.length}</strong>{" "}
          calendar events, and{" "}
          <strong>{repos.length}</strong>{" "}
          GitHub repositories connected.
        </p>
      </div>

      {/* Live Data Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Latest Email */}
        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-primary" />
            <p className="font-semibold">
              Latest Email
            </p>
          </div>

          {latestEmail ? (
            <>
              <p className="mt-4 line-clamp-2 font-medium">
                {latestEmail.subject}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {latestEmail.from}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No emails found
            </p>
          )}
        </div>

        {/* Next Calendar Event */}
        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <p className="font-semibold">
              Next Event
            </p>
          </div>

          {nextEvent ? (
            <>
              <p className="mt-4 line-clamp-2 font-medium">
                {nextEvent.data?.summary ??
                  "Untitled Event"}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {nextEvent.data?.start?.dateTime ??
                  nextEvent.data?.start?.date ??
                  "No date"}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No events found
            </p>
          )}
        </div>

        {/* Latest Repo */}
        <div className="rounded-3xl border bg-white p-6">
          <div className="flex items-center gap-2">
           <GitBranch className="size-4 text-primary" />
            <p className="font-semibold">
              Latest Repository
            </p>
          </div>

          {latestRepo ? (
            <>
              <p className="mt-4 line-clamp-2 font-medium">
                {latestRepo.name}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {latestRepo.language ??
                  "No language"}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No repositories found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}