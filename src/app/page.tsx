import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Command,
  FolderGit2,
  Inbox,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { landingFeatures } from "@/lib/mock-data";

const previewCards = [
  {
    title: "AI brief",
    description: "One view for inbox, meetings, and code delivery risk.",
    icon: Sparkles,
  },
  {
    title: "Inbox triage",
    description: "Priority conversations stay visible, low-signal mail fades back.",
    icon: Inbox,
  },
  {
    title: "GitHub command",
    description: "Track pull requests, issues, and momentum without leaving the flow.",
    icon: FolderGit2,
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute top-0 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Command className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold">CoxswainAI</span>
            <span className="block text-xs text-muted-foreground">AI command workspace</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              Enter workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div>
              <Badge variant="primary" className="mb-6">
                Inspired by Superhuman, Linear, Notion, Arc, and Vercel
              </Badge>
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your inbox, calendar, GitHub, and AI agent in one premium command center.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
                CoxswainAI is built for fast-moving operators. Triage faster, brief yourself instantly, and keep every
                critical thread, meeting, and pull request in one calm interface.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/chat">Explore AI chat</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Clerk authentication ready
                </div>
                <div className="flex items-center gap-2">
                  <MessagesSquare className="size-4 text-primary" />
                  AI-guided command flow
                </div>
                <div className="flex items-center gap-2">
                  <CalendarRange className="size-4 text-primary" />
                  Unified planning surface
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-white/80 bg-white/85 shadow-panel">
              <CardContent className="p-0">
                <div className="border-b border-border bg-slate-950 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-100">Morning command brief</p>
                      <p className="mt-1 text-2xl font-semibold">Stay ahead of the next 3 hours</p>
                    </div>
                    <Badge className="border-white/10 bg-white/10 text-white">Live</Badge>
                  </div>
                </div>

                <div className="grid gap-4 p-6">
                  {previewCards.map((card) => (
                    <div key={card.title} className="rounded-[1.5rem] border border-border bg-secondary/60 p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-primary shadow-soft">
                          <card.icon className="size-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{card.title}</p>
                          <p className="text-sm text-muted-foreground">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-[1.5rem] bg-linear-to-br from-primary to-accent p-6 text-primary-foreground shadow-soft">
                    <p className="text-sm text-blue-100">Coxswain recommendation</p>
                    <p className="mt-3 text-xl font-semibold">Reply to the onboarding escalation before your 10:30 sync.</p>
                    <p className="mt-3 text-sm leading-7 text-blue-50">
                      Then clear the release review window and preserve 45 minutes for prep before the product review.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {landingFeatures.map((feature) => (
              <Card key={feature.title} className="bg-white">
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Card className="overflow-hidden bg-white">
            <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-border p-8 lg:border-r lg:border-b-0">
                <Badge variant="outline">Product preview</Badge>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight">A workspace that feels fast, deliberate, and deeply operational.</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  The frontend is designed like a premium SaaS cockpit: sharp typography, soft surfaces, compact density,
                  and high-signal cards that make action feel obvious.
                </p>
                <div className="mt-8 grid gap-4">
                  {[
                    "Dashboard with KPI cards, summaries, and workspace telemetry",
                    "Chat experience with prompts, history, tool result cards, and AI flow",
                    "Superhuman-inspired inbox, calendar planning, and GitHub oversight",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-linear-to-br from-slate-950 via-slate-900 to-primary p-8 text-white">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm text-blue-100">Unread priority</p>
                    <p className="mt-2 text-4xl font-semibold">12</p>
                    <p className="mt-4 text-sm text-blue-50">AI-sorted by urgency, customer importance, and follow-up risk.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm text-blue-100">Review window</p>
                    <p className="mt-2 text-4xl font-semibold">45m</p>
                    <p className="mt-4 text-sm text-blue-50">Protected between meetings so the day keeps moving.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 md:col-span-2">
                    <p className="text-sm text-blue-100">GitHub delivery</p>
                    <p className="mt-2 text-2xl font-semibold">2 release-lane PRs need a final pass before merge.</p>
                    <p className="mt-4 text-sm leading-7 text-blue-50">
                      CoxswainAI brings the technical context into the same command view as the communication context.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/60 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 CoxswainAI. Premium AI workflow surfaces for operators and builders.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/chat" className="hover:text-foreground">
              Chat
            </Link>
            <Link href="/inbox" className="hover:text-foreground">
              Inbox
            </Link>
            <Link href="/github" className="hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
