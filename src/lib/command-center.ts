type MailLike = {
  id: string;
  subject?: string | null;
  from?: string | null;
  snippet?: string | null;
};

type CalendarEventLike = {
  entity_id?: string;
  id?: string;
  data?: {
    summary?: string | null;
    location?: string | null;
    attendees?: Array<{ email?: string | null }> | null;
    start?: {
      dateTime?: string | null;
      date?: string | null;
    } | null;
    end?: {
      dateTime?: string | null;
      date?: string | null;
    } | null;
  } | null;
};

type RepoLike = {
  id: string | number;
  name: string;
  description?: string | null;
  visibility?: string | null;
  stargazers_count?: number | null;
  open_issues_count?: number | null;
  language?: string | null;
  updated_at?: string | null;
  owner?: {
    login?: string | null;
  } | null;
};

type IssueLike = {
  id: string | number;
  number?: number | null;
  title?: string | null;
  state?: string | null;
  created_at?: string | null;
  user?: {
    login?: string | null;
  } | null;
};

type PullRequestLike = {
  id: string | number;
  number?: number | null;
  title?: string | null;
  state?: string | null;
  created_at?: string | null;
  user?: {
    login?: string | null;
  } | null;
};

type CommitLike = {
  sha?: string | null;
  commit?: {
    message?: string | null;
    author?: {
      name?: string | null;
      date?: string | null;
    } | null;
  } | null;
};

export type WorkspaceRoute = "gmail" | "calendar" | "github" | "general";
export type InboxCategory = "important" | "unread" | "newsletters" | "promotions";
export type UrgencyLevel = "high" | "medium" | "low";

export type ToolField = {
  label: string;
  value: string;
};

export type ToolResultCard = {
  title: string;
  detail: string;
  metric?: string;
  tone?: WorkspaceRoute;
  fields?: ToolField[];
};

export type SuggestedAction = {
  label: string;
  prompt: string;
};

export type ClassifiedEmail = {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  category: InboxCategory;
  summary: string;
  urgency: UrgencyLevel;
  actionRequired: string;
  labelIds?: string[];
  internalDate?: string | null;
  unread?: boolean;
  starred?: boolean;
};

export type WorkspaceCalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  attendees: string[];
};

export type CalendarInsights = {
  todayMeetings: number;
  weeklyMeetingCount: number;
  focusHours: number;
  busiestDay: string;
  longestMeetingMinutes: number;
  nextMeeting: WorkspaceCalendarEvent | null;
  freeBlocks: Array<{
    label: string;
    minutes: number;
  }>;
};

export type GithubDigest = {
  summary: string;
  blockedWork: string[];
  recentCommitSummary: string[];
  openPullRequests: number;
  openIssues: number;
};

export type ChatApiResponse = {
  source?: string;
  response?: string;
  result?: unknown;
  event?: Record<string, unknown>;
  eventData?: Record<string, unknown>;
  emailData?: Record<string, unknown>;
  issue?: Record<string, unknown>;
  comment?: Record<string, unknown>;
  emails?: Array<Record<string, unknown>>;
  events?: Array<Record<string, unknown>>;
  repos?: Array<Record<string, unknown>>;
  issues?: Array<Record<string, unknown>>;
  pullRequests?: Array<Record<string, unknown>>;
  commits?: Array<Record<string, unknown>>;
  branches?: Array<Record<string, unknown>>;
  draft?: string;
  actions?: Array<Record<string, unknown>>;
};

function firstSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const match = trimmed.match(/(.+?[.!?])(\s|$)/);
  return (match?.[1] ?? trimmed).slice(0, 160);
}

function normalizeText(...parts: Array<string | null | undefined>) {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function dedupeById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export function classifyEmail(email: MailLike): ClassifiedEmail {
  const subject = email.subject?.trim() || "No Subject";
  const from = email.from?.trim() || "Unknown Sender";
  const snippet = email.snippet?.trim() || "";
  const haystack = normalizeText(subject, from, snippet);

  const importantSignals = [
    "urgent",
    "customer",
    "board",
    "review",
    "action required",
    "need",
    "please",
    "asap",
    "meeting",
    "tomorrow",
  ];
  const newsletterSignals = [
    "newsletter",
    "digest",
    "substack",
    "weekly",
    "roundup",
    "updates",
  ];
  const promotionSignals = [
    "sale",
    "discount",
    "promo",
    "offer",
    "webinar",
    "launch",
    "deal",
  ];

  const category: InboxCategory =
    importantSignals.some((signal) => haystack.includes(signal))
      ? "important"
      : newsletterSignals.some((signal) => haystack.includes(signal))
        ? "newsletters"
        : promotionSignals.some((signal) => haystack.includes(signal))
          ? "promotions"
          : "unread";

  const urgency: UrgencyLevel =
    category === "important"
      ? "high"
      : haystack.includes("today") || haystack.includes("tomorrow") || haystack.includes("follow up")
        ? "medium"
        : "low";

  const actionRequired =
    urgency === "high"
      ? "Reply or delegate soon."
      : urgency === "medium"
        ? "Worth checking this block."
        : category === "newsletters"
          ? "Skim or archive."
          : "No immediate action required.";

  return {
    id: email.id,
    subject,
    from,
    snippet,
    category,
    summary: firstSentence(`${subject}. ${snippet}`),
    urgency,
    actionRequired,
  };
}

export function groupEmails(emails: MailLike[]) {
  const classified = emails.map(classifyEmail);

  return {
    all: classified,
    important: classified.filter((email) => email.category === "important"),
    unread: classified.filter((email) => email.category === "unread" || email.category === "important"),
    newsletters: classified.filter((email) => email.category === "newsletters"),
    promotions: classified.filter((email) => email.category === "promotions"),
  };
}

export function buildDailyDigest(emails: MailLike[]) {
  const groups = groupEmails(emails);

  return {
    unreadCount: groups.unread.length,
    importantCount: groups.important.length,
    urgentCount: groups.all.filter((email) => email.urgency === "high").length,
    topItems: groups.important.slice(0, 3),
  };
}

export function naturalLanguageToGmailQuery(input: string) {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  const query: string[] = [];
  const fromMatch = normalized.match(/from\s+([a-z0-9@._ -]+)/i);
  const aboutMatch = normalized.match(/about\s+([a-z0-9._ -]+)/i);

  if (normalized.includes("unread")) {
    query.push("is:unread");
  }

  if (normalized.includes("last week")) {
    query.push("newer_than:7d");
  } else if (normalized.includes("today")) {
    query.push("newer_than:1d");
  } else if (normalized.includes("yesterday")) {
    query.push("newer_than:2d older_than:1d");
  }

  if (normalized.includes("newsletter")) {
    query.push("category:updates");
  }

  if (normalized.includes("promotion")) {
    query.push("category:promotions");
  }

  if (fromMatch?.[1]) {
    const sender = fromMatch[1]
      .split(" about ")[0]
      .trim()
      .replace(/\s+/g, " ");
    query.push(`from:${sender}`);
  }

  if (aboutMatch?.[1]) {
    query.push(aboutMatch[1].trim());
  }

  if (query.length === 0) {
    return input;
  }

  return query.join(" ");
}

export function mapCalendarEvents(events: CalendarEventLike[]): WorkspaceCalendarEvent[] {
  return events
    .map((event) => {
      const startValue = event.data?.start?.dateTime ?? event.data?.start?.date;
      const endValue = event.data?.end?.dateTime ?? event.data?.end?.date;

      if (!startValue || !endValue) {
        return null;
      }

      return {
        id: String(event.entity_id ?? event.id ?? startValue),
        title: event.data?.summary?.trim() || "Untitled Event",
        start: new Date(startValue),
        end: new Date(endValue),
        location: event.data?.location?.trim() || "No location",
        attendees:
          event.data?.attendees
            ?.map((attendee) => attendee.email?.trim())
            .filter((value): value is string => Boolean(value)) ?? [],
      };
    })
    .filter((event): event is WorkspaceCalendarEvent => Boolean(event))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours <= 0) {
    return `${remainder}m`;
  }

  if (remainder === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainder}m`;
}

export function buildCalendarInsights(events: WorkspaceCalendarEvent[]): CalendarInsights {
  const now = new Date();
  const todayKey = now.toDateString();
  const todayEvents = events.filter((event) => event.start.toDateString() === todayKey);
  const nextMeeting = events.find((event) => event.start.getTime() >= now.getTime()) ?? null;

  const dayCounts = new Map<string, number>();
  let totalMeetingMinutes = 0;
  let longestMeetingMinutes = 0;

  for (const event of events) {
    const duration = Math.max(0, Math.round((event.end.getTime() - event.start.getTime()) / 60000));
    totalMeetingMinutes += duration;
    longestMeetingMinutes = Math.max(longestMeetingMinutes, duration);

    const key = event.start.toLocaleDateString("en-US", { weekday: "long" });
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }

  const busiestDay =
    Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "No meetings";

  const workStart = new Date(now);
  workStart.setHours(9, 0, 0, 0);
  const workEnd = new Date(now);
  workEnd.setHours(18, 0, 0, 0);
  const todaySorted = [...todayEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
  const freeBlocks: Array<{ label: string; minutes: number }> = [];

  let cursor = workStart;

  for (const event of todaySorted) {
    if (event.start.getTime() > cursor.getTime()) {
      const minutes = Math.round((event.start.getTime() - cursor.getTime()) / 60000);
      freeBlocks.push({
        label: `${cursor.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
        minutes,
      });
    }

    if (event.end.getTime() > cursor.getTime()) {
      cursor = event.end;
    }
  }

  if (workEnd.getTime() > cursor.getTime()) {
    freeBlocks.push({
      label: `${cursor.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${workEnd.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
      minutes: Math.round((workEnd.getTime() - cursor.getTime()) / 60000),
    });
  }

  const busyHours = totalMeetingMinutes / 60;
  const focusHours = Math.max(0, 40 - busyHours);

  return {
    todayMeetings: todayEvents.length,
    weeklyMeetingCount: events.length,
    focusHours: Number(focusHours.toFixed(1)),
    busiestDay,
    longestMeetingMinutes,
    nextMeeting,
    freeBlocks: freeBlocks.filter((block) => block.minutes >= 30),
  };
}

export function buildMeetingPreparation(event: WorkspaceCalendarEvent) {
  const participants = event.attendees.length > 0 ? event.attendees : ["No participants listed"];
  const lowerTitle = event.title.toLowerCase();

  const agenda =
    lowerTitle.includes("review")
      ? ["Review current status", "Call out blockers", "Agree next owners"]
      : lowerTitle.includes("sync")
        ? ["Share updates", "Resolve dependencies", "Confirm follow-ups"]
        : ["Clarify desired outcome", "Walk key context", "Capture next steps"];

  return {
    summary: `${event.title} starts ${event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} at ${event.location}.`,
    participants,
    agenda,
  };
}

export function buildGithubDigest(
  repos: RepoLike[],
  issues: IssueLike[],
  pullRequests: PullRequestLike[],
  commits: CommitLike[]
): GithubDigest {
  const recentCommitSummary = commits
    .slice(0, 3)
    .map((commit) => firstSentence(commit.commit?.message || "No commit message"));

  const blockedWork = [
    ...pullRequests
      .filter((pr) => (pr.state || "").toLowerCase() !== "open")
      .slice(0, 2)
      .map((pr) => pr.title || "Pull request needs attention"),
    ...issues
      .filter((issue) => (issue.state || "").toLowerCase() !== "open")
      .slice(0, 1)
      .map((issue) => issue.title || "Issue is blocked"),
  ].filter(Boolean);

  const summary =
    repos.length === 0
      ? "No repositories connected."
      : `${repos.length} repositories connected, ${pullRequests.length} open pull requests in view, and ${issues.length} visible issues.`;

  return {
    summary,
    blockedWork,
    recentCommitSummary,
    openPullRequests: pullRequests.length,
    openIssues: issues.length,
  };
}

export function buildGithubActivityFeed(
  issues: IssueLike[],
  pullRequests: PullRequestLike[],
  commits: CommitLike[]
) {
  const items = [
    ...issues.map((issue) => ({
      id: `issue-${issue.id}`,
      type: "Issue",
      title: issue.title || "Untitled issue",
      actor: issue.user?.login || "Unknown",
      timestamp: issue.created_at || "",
    })),
    ...pullRequests.map((pr) => ({
      id: `pr-${pr.id}`,
      type: "Pull request",
      title: pr.title || "Untitled PR",
      actor: pr.user?.login || "Unknown",
      timestamp: pr.created_at || "",
    })),
    ...commits.map((commit, index) => ({
      id: `commit-${commit.sha ?? index}`,
      type: "Commit",
      title: firstSentence(commit.commit?.message || "No commit message"),
      actor: commit.commit?.author?.name || "Unknown",
      timestamp: commit.commit?.author?.date || "",
    })),
  ];

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function routeFromSource(source?: string): WorkspaceRoute {
  if (!source) {
    return "general";
  }

  if (source.startsWith("gmail")) {
    return "gmail";
  }

  if (source.startsWith("calendar")) {
    return "calendar";
  }

  if (source.startsWith("github")) {
    return "github";
  }

  return "general";
}

export function buildSuggestedActions(source: string | undefined, lastUserMessage: string): SuggestedAction[] {
  const route = routeFromSource(source);

  if (route === "gmail") {
    return [
      {
        label: "Reply",
        prompt: "Draft a short reply to the last email task.",
      },
      {
        label: "Summarize inbox",
        prompt: "Summarize my unread important emails.",
      },
      {
        label: "Search related emails",
        prompt: `Find related emails for: ${lastUserMessage}`,
      },
    ];
  }

  if (route === "calendar") {
    return [
      {
        label: "Reschedule",
        prompt: "Help me reschedule the relevant meeting.",
      },
      {
        label: "Add attendee",
        prompt: "Add an attendee to that meeting.",
      },
      {
        label: "Create follow-up",
        prompt: "Create a follow-up meeting based on that result.",
      },
    ];
  }

  if (route === "github") {
    return [
      {
        label: "Create issue",
        prompt: "Create a GitHub issue for the current problem.",
      },
      {
        label: "View commits",
        prompt: "Show the latest commits for the relevant repository.",
      },
      {
        label: "Open PRs",
        prompt: "List the open pull requests for the relevant repository.",
      },
    ];
  }

  return [
    {
      label: "Ask Gmail",
      prompt: "Summarize my unread important emails.",
    },
    {
      label: "Ask Calendar",
      prompt: "What does the rest of my day look like?",
    },
    {
      label: "Ask GitHub",
      prompt: "Show latest commits for my main repository.",
    },
  ];
}

export function buildToolCardsFromChatResponse(
  payload: ChatApiResponse,
  lastUserMessage: string
) {
  const route = routeFromSource(payload.source);
  const cards: ToolResultCard[] = [];

  if (payload.source === "gmail-send") {
    const recipient =
      String((payload.emailData as { to?: string } | undefined)?.to ?? lastUserMessage.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "Unknown");
    const subject = String((payload.emailData as { subject?: string } | undefined)?.subject ?? "No subject");

    cards.push({
      title: "Email sent",
      detail: payload.response || "Message sent successfully.",
      tone: "gmail",
      fields: [
        { label: "Recipient", value: recipient },
        { label: "Subject", value: subject },
        { label: "Timestamp", value: new Date().toLocaleString() },
      ],
    });
  } else if (payload.source === "calendar-create") {
    const eventData = payload.eventData as { title?: string; start?: string; end?: string } | undefined;

    cards.push({
      title: "Meeting created",
      detail: payload.response || "Event created successfully.",
      tone: "calendar",
      fields: [
        { label: "Title", value: eventData?.title ?? "Untitled Event" },
        { label: "Date", value: eventData?.start ? new Date(eventData.start).toLocaleString() : "Unknown" },
        { label: "Ends", value: eventData?.end ? new Date(eventData.end).toLocaleString() : "Unknown" },
      ],
    });
  } else if (payload.source === "github-issue") {
    const issue = payload.issue as { title?: string; number?: number; html_url?: string } | undefined;

    cards.push({
      title: "GitHub issue created",
      detail: payload.response || "Issue created successfully.",
      tone: "github",
      fields: [
        { label: "Issue", value: issue?.title ?? "New issue" },
        { label: "Number", value: issue?.number ? `#${issue.number}` : "Unknown" },
        { label: "Link", value: issue?.html_url ?? "Available in GitHub" },
      ],
    });
  } else if (payload.source === "github-comment") {
    cards.push({
      title: "GitHub comment added",
      detail: payload.response || "Comment added successfully.",
      tone: "github",
    });
  } else if (payload.source === "github-star") {
    cards.push({
      title: "Repository starred",
      detail: payload.response || "Repository starred successfully.",
      tone: "github",
    });
  } else if (payload.source === "gmail" && Array.isArray(payload.emails)) {
    const emailCards = payload.emails.slice(0, 3).map((email) => ({
      title: String((email.subject as string | undefined) ?? "Email"),
      detail: String((email.snippet as string | undefined) ?? (email.from as string | undefined) ?? "No preview available."),
      tone: "gmail" as const,
      fields: [
        { label: "From", value: String((email.from as string | undefined) ?? "Unknown Sender") },
      ],
    }));

    cards.push(...emailCards);
  } else if (payload.source === "gmail-search" && Array.isArray(payload.emails)) {
    const emailCards = payload.emails.slice(0, 5).map((email) => ({
      title: String((email.subject as string | undefined) ?? "Email"),
      detail: String((email.snippet as string | undefined) ?? "No preview available."),
      tone: "gmail" as const,
      fields: [
        { label: "From", value: String((email.from as string | undefined) ?? "Unknown Sender") },
        { label: "Labels", value: Array.isArray(email.labelIds) ? email.labelIds.join(", ") || "None" : "None" },
        { label: "Unread", value: String(Boolean(email.unread)) },
        { label: "Starred", value: String(Boolean(email.starred)) },
      ],
    }));

    cards.push(...emailCards);
  } else if ((payload.source === "calendar" || payload.source === "calendar-upcoming") && Array.isArray(payload.events)) {
    const eventCards = payload.events.slice(0, 3).map((event) => {
      const eventRecord = event as CalendarEventLike;
      const startValue = eventRecord.data?.start?.dateTime ?? eventRecord.data?.start?.date ?? "";

      return {
        title: eventRecord.data?.summary?.trim() || "Event",
        detail: startValue ? new Date(startValue).toLocaleString() : "No time available",
        tone: "calendar" as const,
      };
    });

    cards.push(...eventCards);
  } else if (payload.source === "github-repos" && Array.isArray(payload.repos)) {
    cards.push({
      title: "Repositories",
      detail: payload.response || "Repository list generated.",
      metric: String(payload.repos.length),
      tone: "github",
    });
  } else if (payload.source === "github-issues" && Array.isArray(payload.issues)) {
    cards.push({
      title: "Open issues",
      detail: payload.response || "Issue list generated.",
      metric: String(payload.issues.length),
      tone: "github",
    });
  } else if (payload.source === "github-prs" && Array.isArray(payload.pullRequests)) {
    cards.push({
      title: "Pull requests",
      detail: payload.response || "Pull request list generated.",
      metric: String(payload.pullRequests.length),
      tone: "github",
    });
  } else if (payload.source === "github-commits" && Array.isArray(payload.commits)) {
    cards.push(...payload.commits.slice(0, 3).map((commit) => {
      const typedCommit = commit as CommitLike;
      return {
        title: firstSentence(typedCommit.commit?.message || "Commit"),
        detail: typedCommit.commit?.author?.name || "Unknown author",
        tone: "github" as const,
      };
    }));
  } else if (
  payload.response &&
  !payload.source?.startsWith("structured")
) {
  cards.push({
    title:
      route === "general"
        ? "AI response"
        : `${route[0].toUpperCase()}${route.slice(1)} result`,
    detail: payload.response,
    tone: route,
  });
}

  return {
    route,
    cards: dedupeById(
      cards.map((card, index) => ({
        ...card,
        id: `${card.title}-${index}`,
      }))
    ).map(({ id: _id, ...card }) => card),
    actions: buildSuggestedActions(payload.source, lastUserMessage),
  };
}

export function buildReplyPrompt(email: MailLike) {
  return `Draft a concise professional reply to this email.\nFrom: ${email.from ?? "Unknown Sender"}\nSubject: ${email.subject ?? "No Subject"}\nSnippet: ${email.snippet ?? ""}`;
}

export function buildDigestRecommendations(
  emails: MailLike[],
  events: CalendarEventLike[],
  repos: RepoLike[]
) {
  const digest = buildDailyDigest(emails);
  const calendarInsights = buildCalendarInsights(mapCalendarEvents(events));

  const recommendations: string[] = [];

  if (digest.importantCount > 0) {
    recommendations.push(`You have ${digest.importantCount} important emails worth handling first.`);
  }

  if (calendarInsights.nextMeeting) {
    const minutesUntil = Math.max(
      0,
      Math.round((calendarInsights.nextMeeting.start.getTime() - Date.now()) / 60000)
    );
    recommendations.push(`Your next meeting, ${calendarInsights.nextMeeting.title}, starts in ${minutesUntil} minutes.`);
  }

  if (repos.length > 0) {
    recommendations.push(`${repos.length} GitHub repositories are connected and ready for review.`);
  }

  return recommendations;
}

export { formatMinutes };
