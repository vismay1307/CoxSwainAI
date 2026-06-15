"use client";

import { useDeferredValue, useMemo, useState } from "react";

import EmailListItem from "@/components/inbox/EmailListItem";
import EmailPreview from "@/components/inbox/EmailPreview";
import EmailSearch from "@/components/inbox/EmailSearch";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { emails } from "@/lib/mock-data";

export default function InboxPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selectedId, setSelectedId] = useState(emails[0]?.id ?? "");

  const filteredEmails = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    if (!normalized) {
      return emails;
    }

    return emails.filter((email) =>
      [email.sender, email.subject, email.preview, email.labels.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [deferredQuery]);

  const selectedEmail =
    filteredEmails.find((email) => email.id === selectedId) ?? filteredEmails[0] ?? emails[0];

  return (
    <PageContainer className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Priority aware</Badge>
            <Badge variant="outline">{filteredEmails.length} conversations</Badge>
          </div>
          <CardTitle className="mt-2">Inbox command center</CardTitle>
          <CardDescription>Superhuman-style layout with fast triage, clear hierarchy, and a focused preview pane.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailSearch value={query} onChange={setQuery} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="bg-white">
          <CardContent className="max-h-[calc(100vh-15rem)] space-y-3 overflow-y-auto p-4">
            {filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isActive={selectedEmail?.id === email.id}
                onSelect={() => setSelectedId(email.id)}
              />
            ))}
          </CardContent>
        </Card>

        {selectedEmail ? <EmailPreview email={selectedEmail} /> : null}
      </div>
    </PageContainer>
  );
}
