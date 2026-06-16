"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { api } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import EmailListItem from "@/components/inbox/EmailListItem";
import EmailPreview from "@/components/inbox/EmailPreview";
import EmailSearch from "@/components/inbox/EmailSearch";

import PageContainer from "@/components/layout/PageContainer";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function InboxPage() {
    const { user, isSignedIn } = useUser();

  const [query, setQuery] =
    useState("");

  const deferredQuery =
    useDeferredValue(query);

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



  const [selectedId, setSelectedId] =
    useState("");

  const filteredEmails =
    useMemo(() => {
      const normalized =
        deferredQuery
          .trim()
          .toLowerCase();

      if (!normalized) {
        return emails;
      }

      return emails.filter(
        (email) =>
          email.subject
            ?.toLowerCase()
            .includes(
              normalized
            ) ||
          email.from
            ?.toLowerCase()
            .includes(
              normalized
            ) ||
          email.snippet
            ?.toLowerCase()
            .includes(
              normalized
            )
      );
    }, [
      emails,
      deferredQuery,
    ]);

  const selectedEmail =
    filteredEmails.find(
      (email) =>
        email.id === selectedId
    ) ??
    filteredEmails[0];

  if (isLoading) {
    return (
      <PageContainer>
        Loading emails...
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
if (!emails.length) {
  return (
    <PageContainer>
      No emails found.
    </PageContainer>
  );
}
  return (
    <PageContainer className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">
              Gmail
            </Badge>

            <Badge variant="outline">
              {
                filteredEmails.length
              }{" "}
              emails
            </Badge>
          </div>

          <CardTitle className="mt-2">
            Inbox command center
          </CardTitle>

          <CardDescription>
            Real Gmail
            messages from
            Corsair DB
          </CardDescription>
        </CardHeader>

        <CardContent>
          <EmailSearch
            value={query}
            onChange={setQuery}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="bg-white">
          <CardContent className="max-h-[calc(100vh-15rem)] space-y-3 overflow-y-auto p-4">
            {filteredEmails.map(
              (email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  isActive={
                    selectedEmail?.id ===
                    email.id
                  }
                  onSelect={() =>
                    setSelectedId(
                      email.id
                    )
                  }
                />
              )
            )}
          </CardContent>
        </Card>

        {selectedEmail ? (
          <EmailPreview
            email={
              selectedEmail
            }
          />
        ) : null}
      </div>
    </PageContainer>
  );
}