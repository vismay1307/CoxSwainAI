"use client";
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
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { LandingHeaderActions } from "@/components/landing/LandingHeaderActions";

const previewCards = [
  {
    title: "AI brief",
    description: "One view for inbox, meetings, and code delivery risk.",
    icon: Sparkles,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    title: "Inbox triage",
    description: "Priority conversations stay visible, low-signal mail fades back.",
    icon: Inbox,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    title: "GitHub command",
    description: "Track pull requests, issues, and momentum without leaving the flow.",
    icon: FolderGit2,
    accent: "bg-emerald-50 text-emerald-600",
  },
];const landingFeatures = [
{
title: "Think in briefs",
description:
"Get AI-generated summaries across inbox, calendar, and GitHub without switching contexts.",
icon: Sparkles,
},
{
title: "Clear urgent first",
description:
"Surface the most important conversations, meetings, and delivery risks instantly.",
icon: Inbox,
},
{
title: "Stay in flow",
description:
"Move from insight to action with a single command-center experience.",
icon: Zap,
},
];


export default function HomePage() {
  

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
      },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      {/* Grid background */}
      <div className="bg-grid absolute inset-0 opacity-30" />

      {/* Hero glow */}
      <div className="absolute top-0 left-1/2 h-[36rem] w-[56rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-32 right-0 h-[20rem] w-[20rem] rounded-full bg-violet-400/10 blur-[80px] pointer-events-none" />

      {/* ─── HEADER ─── */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <Command className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">CoxswainAI</span>
            <span className="block text-xs text-muted-foreground">AI command workspace</span>
          </span>
        </Link>

        {/* ✅ FIX: Clerk-aware client component — shows avatar when signed in */}
        <LandingHeaderActions />
      </header>

      {/* ─── MAIN ─── */}
      <main className="relative z-10">

        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
            <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="visible"
>
  
              <Badge variant="primary" className="mb-6 gap-2">
                <Zap className="size-3" />
                Inspired by Superhuman, Linear, Notion, Arc, and Vercel
              </Badge>

              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl leading-[1.05]">
                Your inbox, calendar, GitHub, and AI agent in one{" "}
                <span
className="
text-primary
bg-gradient-to-r
from-primary
via-blue-500
to-violet-600
bg-clip-text
text-transparent
forced-colors:text-[CanvasText]
"
>
                  premium command center.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-500">
                CoxswainAI is built for fast-moving operators. Triage faster, brief yourself
                instantly, and keep every critical thread, meeting, and pull request in one calm
                interface.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
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
                  Clerk authentication
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
           </motion.div>

            {/* Preview card */}
            <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="visible"
>
            <Card
  className="
    overflow-hidden
    bg-card/95
    border-border
    shadow-panel
    backdrop-blur-xl
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-xl
  "
>
              <CardContent className="p-0">
                <div className="border-b border-border bg-slate-950 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-300 uppercase tracking-widest mb-1">
                        Morning brief
                      </p>
                      <p className="text-xl font-semibold leading-snug">
                        Stay ahead of the next 3 hours
                      </p>
                    </div>
                    <Badge className="border-white/10 bg-white/10 text-white text-xs animate-pulse">
                      Live
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 p-5">
                  {previewCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-border/60 bg-slate-50/80 p-4 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex size-9 items-center justify-center rounded-xl ${card.accent}`}>
                          <card.icon className="size-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{card.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl bg-gradient-to-br from-primary to-violet-600 p-5 text-primary-foreground shadow-soft">
                    <p className="text-xs text-blue-100 uppercase tracking-widest mb-2">
                      Coxswain recommendation
                    </p>
                    <p className="text-base font-semibold leading-snug">
                      Reply to the onboarding escalation before your 10:30 sync.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-blue-100/80">
                      Clear the release review window and preserve 45 minutes for product review prep.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              What's inside
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Everything your workflow needs
            </h2>
          </div>
          <motion.div
variants={stagger}
initial="hidden"
whileInView="visible"
viewport={{ once: true }}
className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
>
            {landingFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="bg-white border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
              >
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/8 text-primary group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            </motion.div>
        </section>

        {/* PRODUCT PREVIEW */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp}>
          <Card className="overflow-hidden bg-white border-border/60 shadow-sm">
            <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="border-b border-border p-8 lg:border-r lg:border-b-0">
                <Badge variant="outline" className="mb-6">Product preview</Badge>
                <h2 className="text-2xl font-semibold tracking-tight leading-snug">
                  A workspace that feels fast, deliberate, and deeply operational.
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Sharp typography, soft surfaces, compact density, and high-signal cards that make
                  action feel obvious.
                </p>
                <div className="mt-7 grid gap-3">
                  {[
                    "Dashboard with KPI cards, summaries, and workspace telemetry",
                    "Chat experience with prompts, history, tool result cards, and AI flow",
                    "Superhuman-inspired inbox, calendar planning, and GitHub oversight",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-foreground border border-border/40"
                    >
                      <span className="mt-0.5 size-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-primary p-8 text-white">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors">
                    <p className="text-xs text-blue-300 uppercase tracking-widest mb-2">Unread priority</p>
                    {/* TODO: Replace with real telemetry */}
<p className="text-4xl font-bold tracking-tight">12</p>
                    <p className="mt-3 text-xs leading-relaxed text-blue-100/70">
                      AI-sorted by urgency, customer importance, and follow-up risk.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/8 transition-colors">
                    <p className="text-xs text-blue-300 uppercase tracking-widest mb-2">Review window</p>
                    {/* TODO: Replace with real telemetry */}
<p className="text-4xl font-bold tracking-tight">45m</p>
                    <p className="mt-3 text-xs leading-relaxed text-blue-100/70">
                      Protected between meetings so the day keeps moving.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-2 hover:bg-white/8 transition-colors">
                    <p className="text-xs text-blue-300 uppercase tracking-widest mb-2">GitHub delivery</p>
                    <p className="text-lg font-semibold leading-snug">
                      2 release-lane PRs need a final pass before merge.
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-blue-100/70">
                      Technical context meets communication context in one command view.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card></motion.div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-border/40 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Command className="size-3" />
            </span>
            <p>© 2026 CoxswainAI. Premium AI workflow surfaces for operators and builders.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/chat", label: "Chat" },
              { href: "/inbox", label: "Inbox" },
              { href: "/github", label: "GitHub" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}