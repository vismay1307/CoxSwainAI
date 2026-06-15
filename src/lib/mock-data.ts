import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  CalendarRange,
  FolderGit2,
  Inbox,
  MessagesSquare,
  Sparkles,
  Zap,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export const appNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Sparkles,
  },
  {
    href: "/chat",
    label: "AI Chat",
    icon: MessagesSquare,
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: Inbox,
    badge: "12",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarRange,
  },
  {
    href: "/github",
    label: "GitHub",
    icon: FolderGit2,
  },
];

export const dashboardKpis = [
  {
    label: "Focus hours reclaimed",
    value: "17.8h",
    delta: "+12%",
    tone: "positive" as const,
  },
  {
    label: "Inbox under control",
    value: "93%",
    delta: "-41 unread",
    tone: "positive" as const,
  },
  {
    label: "Meetings optimized",
    value: "24",
    delta: "4 conflicts solved",
    tone: "neutral" as const,
  },
  {
    label: "GitHub throughput",
    value: "31",
    delta: "+8 merged",
    tone: "positive" as const,
  },
];

export const dashboardActivities = [
  {
    title: "AI triaged 18 new emails",
    detail: "Priority senders surfaced, newsletters archived automatically.",
    time: "2 min ago",
  },
  {
    title: "Calendar conflict resolved",
    detail: "Moved the design review to a free 2:30 PM slot and added context notes.",
    time: "18 min ago",
  },
  {
    title: "GitHub digest generated",
    detail: "Summarized changes across three active repos for the leadership standup.",
    time: "42 min ago",
  },
];

export const dashboardSummaries = [
  {
    title: "Morning brief",
    summary:
      "You have 4 urgent emails, 2 prep blocks before lunch, and one deployment PR awaiting review from backend.",
  },
  {
    title: "Risk radar",
    summary:
      "The product sync overlaps with a customer escalation thread. CoxswainAI recommends handling inbox follow-up first.",
  },
];

export const dashboardStats = {
  email: [
    { label: "Unread priority", value: "12" },
    { label: "Replied today", value: "28" },
    { label: "Auto-archived", value: "64" },
  ],
  calendar: [
    { label: "Upcoming meetings", value: "7" },
    { label: "Deep work blocks", value: "3" },
    { label: "Conflicts prevented", value: "2" },
  ],
  github: [
    { label: "PRs open", value: "9" },
    { label: "Issues assigned", value: "14" },
    { label: "Commits this week", value: "57" },
  ],
};

export type ToolResult = {
  title: string;
  detail: string;
  metric?: string;
};

export type ChatMessageRecord = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolResults?: ToolResult[];
};

export const chatSessions = [
  {
    id: "daily-brief",
    title: "Daily command brief",
    preview: "Summarize inbox, calendar, and GitHub priorities before 9 AM.",
  },
  {
    id: "launch-war-room",
    title: "Launch war room",
    preview: "Track release blockers and convert GitHub issues into a handoff plan.",
  },
  {
    id: "exec-rollup",
    title: "Exec rollup",
    preview: "Draft a leadership update from recent team activity.",
  },
];

export const suggestedPrompts = [
  "Summarize my unread emails and show what needs a reply first.",
  "Find open pull requests that could block tomorrow's deployment.",
  "Draft a schedule for my afternoon around the customer review.",
  "Create a concise leadership update from today's inbox and GitHub activity.",
];

export const initialChatMessages: ChatMessageRecord[] = [
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "Good morning. I grouped your workspace into three priorities: customer follow-up, a 1 PM product review, and two GitHub pull requests that need sign-off.",
    timestamp: "08:43 AM",
    toolResults: [
      {
        title: "Inbox signal",
        detail: "12 unread priority emails, 4 from exec or customers.",
        metric: "12",
      },
      {
        title: "Calendar focus",
        detail: "One scheduling conflict and a 90-minute deep work window after lunch.",
        metric: "1",
      },
      {
        title: "GitHub attention",
        detail: "2 PRs tagged high priority in the release lane.",
        metric: "2",
      },
    ],
  },
  {
    id: "user-1",
    role: "user",
    content: "Give me the fastest plan to clear the next two hours.",
    timestamp: "08:44 AM",
  },
  {
    id: "assistant-2",
    role: "assistant",
    content:
      "Start with the customer escalation thread, then approve the API docs PR, and protect 45 minutes for prep before the product review. I can draft the customer reply if you want.",
    timestamp: "08:44 AM",
  },
];

export type EmailRecord = {
  id: string;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread?: boolean;
  labels: string[];
};

export const emails: EmailRecord[] = [
  {
    id: "1",
    sender: "Maya Chen",
    email: "maya@northstar.io",
    subject: "Need final talking points for tomorrow's QBR",
    preview: "Can you tighten the executive framing before I share with the board?",
    body:
      "Can you tighten the executive framing before I share with the board? The current deck is close, but I want clearer messaging on customer retention, roadmap confidence, and the rollout timeline. If CoxswainAI can summarize the latest GitHub and inbox signals into three bullets, that would help.",
    time: "09:12",
    unread: true,
    labels: ["VIP", "Board"],
  },
  {
    id: "2",
    sender: "Avery Park",
    email: "avery@coxswain.ai",
    subject: "Customer escalation: onboarding blocked",
    preview: "The workspace sync still fails on first import for two enterprise accounts.",
    body:
      "The workspace sync still fails on first import for two enterprise accounts. Support logged a workaround, but the accounts team wants an ETA before the 1 PM call. Please coordinate with engineering and send a customer-safe update.",
    time: "08:54",
    unread: true,
    labels: ["Urgent", "Customer"],
  },
  {
    id: "3",
    sender: "Vercel",
    email: "alerts@vercel.com",
    subject: "Deployment completed successfully",
    preview: "Production build for coxswain-app finished in 2m 14s.",
    body:
      "Production build for coxswain-app finished in 2m 14s. Build output looks healthy and all preview checks passed. The latest deployment is now live.",
    time: "08:20",
    labels: ["Deploy"],
  },
  {
    id: "4",
    sender: "Jordan Tate",
    email: "jordan@studioform.co",
    subject: "Design review agenda for this afternoon",
    preview: "I added a stronger mobile navigation concept and a refined KPI section.",
    body:
      "I added a stronger mobile navigation concept and a refined KPI section. For the review, I'd like feedback on the information hierarchy in the dashboard and whether the inbox density feels intentional enough for power users.",
    time: "Yesterday",
    labels: ["Design"],
  },
  {
    id: "5",
    sender: "GitHub",
    email: "notifications@github.com",
    subject: "[coxswain-app] PR #184 is ready for review",
    preview: "Frontend shell refinements and loading-state cleanup are ready.",
    body:
      "Frontend shell refinements and loading-state cleanup are ready. Reviewers requested one more pass on keyboard navigation and responsive overflow behavior before merge.",
    time: "Yesterday",
    labels: ["GitHub"],
  },
];

export type EventRecord = {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  type: "focus" | "meeting" | "review";
};

export const upcomingEvents: EventRecord[] = [
  {
    id: "evt-1",
    title: "Customer escalation sync",
    time: "10:30 AM",
    duration: "30 min",
    attendees: ["Support", "PM", "Eng"],
    location: "Zoom",
    type: "meeting",
  },
  {
    id: "evt-2",
    title: "Deep work: inbox zero",
    time: "11:15 AM",
    duration: "45 min",
    attendees: ["Solo"],
    location: "Focus mode",
    type: "focus",
  },
  {
    id: "evt-3",
    title: "Product review",
    time: "1:00 PM",
    duration: "60 min",
    attendees: ["Product", "Design", "Leadership"],
    location: "Atlas room",
    type: "review",
  },
];

export const weeklyOverview = [
  {
    day: "Mon",
    focus: "Launch planning",
    meetings: 3,
    freeHours: 4.5,
  },
  {
    day: "Tue",
    focus: "Customer discovery",
    meetings: 5,
    freeHours: 2.5,
  },
  {
    day: "Wed",
    focus: "Build sprint",
    meetings: 2,
    freeHours: 5,
  },
  {
    day: "Thu",
    focus: "Design systems",
    meetings: 4,
    freeHours: 3,
  },
  {
    day: "Fri",
    focus: "Executive wrap-up",
    meetings: 3,
    freeHours: 4,
  },
];

export type RepoRecord = {
  id: string;
  name: string;
  description: string;
  visibility: "Private" | "Public";
  stars: number;
  prs: number;
  issues: number;
  updated: string;
};

export const repositories: RepoRecord[] = [
  {
    id: "repo-1",
    name: "coxswain-app",
    description: "Primary product workspace for AI-assisted communication and coordination.",
    visibility: "Private",
    stars: 128,
    prs: 6,
    issues: 14,
    updated: "5 min ago",
  },
  {
    id: "repo-2",
    name: "coxswain-design-system",
    description: "Shared design primitives, tokens, and layout patterns for the app shell.",
    visibility: "Private",
    stars: 84,
    prs: 2,
    issues: 7,
    updated: "1 hour ago",
  },
  {
    id: "repo-3",
    name: "coxswain-integrations",
    description: "Connectors for email, calendar, and developer workflows.",
    visibility: "Private",
    stars: 61,
    prs: 4,
    issues: 11,
    updated: "3 hours ago",
  },
];

export const issues = [
  {
    id: "#322",
    title: "Inbox preview should preserve keyboard context when switching threads",
    status: "In progress",
    owner: "Jordan",
  },
  {
    id: "#317",
    title: "Calendar event cards need better overflow handling on smaller screens",
    status: "Review",
    owner: "Nina",
  },
  {
    id: "#308",
    title: "Chat tool result cards need clearer empty-state hierarchy",
    status: "Todo",
    owner: "Avery",
  },
];

export const pullRequests = [
  {
    id: "PR #184",
    title: "Refine app shell, sidebar density, and mobile sheet navigation",
    author: "pkj",
    state: "Ready to merge",
  },
  {
    id: "PR #179",
    title: "Add GitHub digest summaries to daily briefing cards",
    author: "maya",
    state: "Awaiting review",
  },
  {
    id: "PR #175",
    title: "Improve calendar CTA flows and event metadata chips",
    author: "jordan",
    state: "Changes requested",
  },
];

export const commitActivity = [
  {
    label: "Mon",
    commits: 9,
  },
  {
    label: "Tue",
    commits: 14,
  },
  {
    label: "Wed",
    commits: 12,
  },
  {
    label: "Thu",
    commits: 18,
  },
  {
    label: "Fri",
    commits: 11,
  },
];

export const landingFeatures = [
  {
    title: "Think in briefs, not tabs",
    description:
      "CoxswainAI condenses inbox, schedule, and codebase activity into one calm operating surface.",
    icon: Sparkles,
  },
  {
    title: "Clear the urgent first",
    description:
      "Priority scoring, summaries, and one-tap actions keep the important threads moving.",
    icon: Zap,
  },
  {
    title: "Stay in flow",
    description:
      "The app shell is built for fast navigation, minimal friction, and constant situational awareness.",
    icon: ArrowUpRight,
  },
];
