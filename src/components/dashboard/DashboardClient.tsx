"use client";

import { Mail, CalendarDays, GitBranch, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import PageSkeleton from "@/components/ui/PageSkeleton";
import {
  buildCalendarInsights,
  buildDailyDigest,
  buildDigestRecommendations,
  mapCalendarEvents,
} from "@/lib/command-center";
import { api } from "@/trpc/client";

export default function DashboardClient() {
  const emailQuery = api.gmail.readEmails.useQuery(
    {
      maxResults: 20,
    },
    {
      refetchOnWindowFocus: true,
    }
  );
  const calendarQuery = api.calendar.weekEvents.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });
  const reposQuery = api.github.repos.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  if (emailQuery.isLoading || calendarQuery.isLoading || reposQuery.isLoading) {
    return <PageSkeleton cards={3} rows={2} />;
  }

  if (emailQuery.error || calendarQuery.error || reposQuery.error) {
    return (
      <ErrorState
        description={
          emailQuery.error?.message ||
          calendarQuery.error?.message ||
          reposQuery.error?.message ||
          "Could not load the command center overview."
        }
      />
    );
  }

  const emails = emailQuery.data ?? [];
  const rawEvents = calendarQuery.data ?? [];
  const repos = reposQuery.data ?? [];
  const digest = buildDailyDigest(emails);
  const calendarInsights = buildCalendarInsights(mapCalendarEvents(rawEvents as never[]));
  const recommendations = buildDigestRecommendations(emails, rawEvents as never[], repos as never[]);

  const overviewCards = [
    {
      label: "Inbox overview",
      value: String(digest.unreadCount),
      detail: `${digest.importantCount} important emails in the queue`,
      icon: Mail,
      href: "/inbox",
    },
    {
      label: "Calendar overview",
      value: String(calendarInsights.todayMeetings),
      detail: calendarInsights.nextMeeting
        ? `Next: ${calendarInsights.nextMeeting.title}`
        : "No upcoming meeting right now",
      icon: CalendarDays,
      href: "/calendar",
    },
    {
      label: "GitHub overview",
      value: String(repos.length),
      detail: repos.length > 0 ? `${repos[0]?.name} is the most recently loaded repo` : "No repositories connected",
      icon: GitBranch,
      href: "/github",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
          <Card key={card.label} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <card.icon className="size-5" />
                </span>
                <Button asChild variant="outline" size="sm">
                  <Link href={card.href}>
                    Open
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-primary text-white">
          <CardContent className="p-8">
            <Badge className="border-white/10 bg-white/10 text-white">
              <Sparkles className="mr-1 size-3" />
              AI recommendations
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">One command center for email, meetings, and delivery signal.</h2>
            <div className="mt-6 space-y-3">
              {recommendations.map((recommendation) => (
                <div key={recommendation} className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-blue-50">
                  {recommendation}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Actionable cards</CardTitle>
            <CardDescription>What needs attention across the connected workspaces right now.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[1.5rem] bg-secondary/70 p-5">
              <p className="text-sm font-semibold">Inbox overview</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {digest.topItems[0]?.summary ?? "Inbox is calm at the moment."}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-secondary/70 p-5">
              <p className="text-sm font-semibold">Calendar overview</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {calendarInsights.freeBlocks[0]
                  ? `You still have a ${calendarInsights.freeBlocks[0].minutes}-minute block at ${calendarInsights.freeBlocks[0].label}.`
                  : "No major free block is available today."}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-secondary/70 p-5">
              <p className="text-sm font-semibold">GitHub overview</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {repos.length > 0
                  ? `${repos.length} repositories are connected and ready for command-center review.`
                  : "No GitHub repository data is currently available."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
