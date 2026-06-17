"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Inbox, Search, Sparkles } from "lucide-react";

import EmailListItem from "@/components/inbox/EmailListItem";
import EmailPreview from "@/components/inbox/EmailPreview";
import EmailSearch from "@/components/inbox/EmailSearch";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import PageSkeleton from "@/components/ui/PageSkeleton";
import {
  buildDailyDigest,
  classifyEmail,
  groupEmails,
  naturalLanguageToGmailQuery,
} from "@/lib/command-center";
import { api } from "@/trpc/client";

type EmailItem = {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  labelIds?: string[];
  internalDate?: string | null;
  unread?: boolean;
  starred?: boolean;
};

type SearchEmailItem = {
  id?: string;
  snippet?: string;
  subject?: string;
  from?: string;
  internalDate?: string | null;
  labelIds?: string[];
  unread?: boolean;
  starred?: boolean;
  payload?: {
    headers?: Array<{
      name?: string;
      value?: string;
    }>;
  };
};

function mapSearchResults(rawEmails: SearchEmailItem[]): EmailItem[] {
  return rawEmails.map((email, index) => {
    const headers = email.payload?.headers ?? [];
    const subject =
      email.subject ??
      headers.find((header) => header.name?.toLowerCase() === "subject")?.value ??
      "No Subject";
    const from =
      email.from ??
      headers.find((header) => header.name?.toLowerCase() === "from")?.value ??
      "Unknown Sender";

    return {
      id: email.id ?? `search-${index}`,
      subject,
      from,
      snippet: email.snippet ?? "",
      labelIds: email.labelIds ?? [],
      internalDate: email.internalDate ?? null,
      unread: Boolean(email.unread),
      starred: Boolean(email.starred),
    };
  });
}

export default function InboxPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedId, setSelectedId] = useState("");
  const [searchResults, setSearchResults] = useState<EmailItem[] | null>(null);
  const [searchSummary, setSearchSummary] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const {
    data: emails = [],
    isLoading,
    error,
    refetch,
  } = api.gmail.readEmails.useQuery(
    {
      maxResults: 20,
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
      refetchInterval: 30000,
    }
  );

  const sourceEmails = searchResults ?? emails;
  const grouped = useMemo(() => groupEmails(sourceEmails), [sourceEmails]);
  const dailyDigest = useMemo(() => buildDailyDigest(sourceEmails), [sourceEmails]);

  const filteredEmails = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return grouped.all;
    }

    return grouped.all.filter((email) =>
      [email.subject, email.from, email.snippet, email.summary].join(" ").toLowerCase().includes(normalized)
    );
  }, [deferredQuery, grouped.all]);

  const selectedEmail = filteredEmails.find((email) => email.id === selectedId) ?? filteredEmails[0] ?? null;

  async function runNaturalLanguageSearch() {
    const normalized = query.trim();

    if (!normalized) {
      setSearchResults(null);
      setSearchSummary("");
      setSearchError("");
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const naturalPrompt = `search emails ${normalized}`;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: naturalPrompt,
        }),
      });

      const data = await response.json();
      const rawEmails = Array.isArray(data.emails) ? data.emails : [];
      const mappedEmails = mapSearchResults(rawEmails);

      setSearchResults(mappedEmails);
      setSearchSummary(data.response ?? `Found ${mappedEmails.length} emails for ${naturalLanguageToGmailQuery(normalized)}`);
      setSelectedId(mappedEmails[0]?.id ?? "");
    } catch {
      setSearchError("Natural language search is temporarily unavailable.");
    } finally {
      setSearching(false);
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <PageSkeleton cards={4} rows={5} />
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

  if (!emails.length && !searchResults?.length) {
    return (
      <PageContainer>
        <EmptyState
          icon={Inbox}
          title="No emails available"
          description="Your Gmail workspace is connected, but there are no messages to display yet."
          action={
            <Button onClick={() => void refetch()}>
              Refresh inbox
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Priority inbox</Badge>
            <Badge variant="outline">{grouped.all.length} emails in view</Badge>
            {searchResults ? <Badge variant="outline">Natural language search active</Badge> : null}
          </div>

          <CardTitle className="mt-2">Professional Gmail workspace</CardTitle>
          <CardDescription>
            Prioritized from the connected Gmail data, with lightweight AI classification and draft assistance.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <EmailSearch value={query} onChange={setQuery} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                setQuery("");
                setSearchResults(null);
                setSearchSummary("");
                setSearchError("");
              }}>
                Clear
              </Button>
              <Button onClick={() => void runNaturalLanguageSearch()} disabled={searching}>
                <Search className="size-4" />
                Search
              </Button>
            </div>
          </div>

          {searchSummary ? (
            <div className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">{searchSummary}</div>
          ) : null}

          {searchError ? <ErrorState description={searchError} /> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Unread count</p>
            <p className="mt-2 text-3xl font-semibold">{dailyDigest.unreadCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Important emails</p>
            <p className="mt-2 text-3xl font-semibold">{dailyDigest.importantCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Urgent emails</p>
            <p className="mt-2 text-3xl font-semibold">{dailyDigest.urgentCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <span className="text-sm font-medium">Daily digest</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {dailyDigest.topItems[0]?.summary ?? "Inbox looks quiet right now."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Priority groups</CardTitle>
              <CardDescription>Important, unread, newsletters, and promotions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                { label: "Important", value: grouped.important.length },
                { label: "Unread", value: grouped.unread.length },
                { label: "Newsletters", value: grouped.newsletters.length },
                { label: "Promotions", value: grouped.promotions.length },
              ].map((group) => (
                <div key={group.label} className="flex items-center justify-between rounded-2xl bg-secondary/70 px-4 py-3">
                  <span className="text-sm font-medium">{group.label}</span>
                  <Badge variant="outline">{group.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Message list</CardTitle>
              <CardDescription>Each email includes summary, urgency, and required action.</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-18rem)] space-y-3 overflow-y-auto p-4">
              {filteredEmails.map((email) => (
              <EmailListItem
                  key={email.id}
                  email={{
                    id: email.id,
                    from: email.from,
                    subject: email.subject,
                    snippet: `${email.summary} ${email.actionRequired}`,
                    unread: Boolean((email as EmailItem).unread),
                    starred: Boolean((email as EmailItem).starred),
                  }}
                  isActive={selectedEmail?.id === email.id}
                  onSelect={() => setSelectedId(email.id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {selectedEmail ? (
          <EmailPreview
            email={{
              id: selectedEmail.id,
              subject: selectedEmail.subject,
              from: selectedEmail.from,
              snippet: selectedEmail.snippet,
              summary: selectedEmail.summary,
              urgency: selectedEmail.urgency,
              actionRequired: selectedEmail.actionRequired,
              labelIds: selectedEmail.labelIds,
              internalDate: selectedEmail.internalDate,
              unread: selectedEmail.unread,
              starred: selectedEmail.starred,
            }}
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title="No email selected"
            description="Select a conversation to inspect the summary, urgency, and draft options."
          />
        )}
      </div>
    </PageContainer>
  );
}
