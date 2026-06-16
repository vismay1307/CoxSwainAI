import { ArrowUpRight, CalendarCheck2, Inbox, Sparkles, Telescope } from "lucide-react";
import DashboardClient from "@/components/dashboard/DashboardClient";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { dashboardActivities, dashboardKpis, dashboardStats, dashboardSummaries } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <PageContainer className="space-y-8">
      <DashboardClient />
      <section className="grid gap-4 xl:grid-cols-4">
        {dashboardKpis.map((kpi) => (
          <Card key={kpi.label} className="bg-white">
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <div className="flex items-end justify-between gap-4">
                <p className="text-4xl font-semibold tracking-tight">{kpi.value}</p>
                <Badge variant={kpi.tone === "positive" ? "success" : "outline"}>{kpi.delta}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-primary text-white">
          <CardContent className="p-8">
            <Badge className="border-white/10 bg-white/10 text-white">AI overview</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Your command brief is stable, but the inbox still drives the day.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50">
              Clear the onboarding escalation, protect the product review prep, and approve the app-shell PR before
              lunch. CoxswainAI already sorted the rest into later-action queues.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary">
                Open inbox
                <Inbox className="size-4" />
              </Button>
              <Button variant="outline" className="border-white/15 bg-white/8 text-white hover:bg-white/12">
                Review schedule
                <CalendarCheck2 className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>AI summaries</CardTitle>
            <CardDescription>Two concise perspectives to steer the next block of work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardSummaries.map((summary) => (
              <div key={summary.title} className="rounded-[1.5rem] bg-secondary/70 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="size-4 text-primary" />
                  {summary.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{summary.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Live operational signal across the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardActivities.map((activity) => (
              <div key={activity.title} className="rounded-[1.5rem] border border-border bg-secondary/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{activity.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Inbox className="size-4 text-primary" />
                Email stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.email.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-secondary/70 p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheck2 className="size-4 text-primary" />
                Calendar stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.calendar.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-secondary/70 p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Telescope className="size-4 text-primary" />
                GitHub stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardStats.github.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-secondary/70 p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick launch actions</CardTitle>
            <CardDescription>Jump straight into the most likely next moves.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {[
              "Draft a customer-safe escalation update",
              "Summarize today's GitHub delivery risk",
              "Protect a 45-minute prep block before review",
            ].map((item) => (
              <Button key={item} variant="outline" className="h-auto justify-between rounded-[1.5rem] px-4 py-5 text-left">
                <span className="max-w-[16rem] text-sm leading-6">{item}</span>
                <ArrowUpRight className="size-4 shrink-0" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
