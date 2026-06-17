"use client";

import { useState } from "react";
import { Check, Reply, Star } from "lucide-react";

import ReplyComposerDialog from "@/components/inbox/ReplyComposerDialog";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { buildReplyPrompt } from "@/lib/command-center";
import { api } from "@/trpc/client";

type Email = {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  summary?: string;
  urgency?: "high" | "medium" | "low";
  actionRequired?: string;
};

type EmailPreviewProps = {
  email: Email;
};

export default function EmailPreview({
  email,
}: EmailPreviewProps) {
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const utils = api.useUtils();

  const markReadMutation = api.gmail.markRead.useMutation({
    onSuccess: () => {
      utils.gmail.readEmails.invalidate();
    },
  });

  const starMutation = api.gmail.starEmail.useMutation({
    onSuccess: () => {
      utils.gmail.readEmails.invalidate();
    },
  });

  const recipient =
    email.from.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? email.from;

  const urgencyVariant =
    email.urgency === "high"
      ? "warning"
      : email.urgency === "medium"
        ? "primary"
        : "outline";

  return (
    <>
      <Card className="h-full bg-white">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-12">
                <AvatarFallback>{email.from.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-semibold">{email.from}</p>
                <p className="text-sm text-muted-foreground">Gmail message</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  starMutation.mutate({
                    emailId: email.id,
                  })
                }
                aria-label="Star email"
              >
                <Star className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  markReadMutation.mutate({
                    emailId: email.id,
                  })
                }
                aria-label="Mark email as read"
              >
                <Check className="size-4" />
              </Button>
              <Button size="icon" aria-label="Generate reply" onClick={() => setShowReplyDialog(true)}>
                <Reply className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="primary">Gmail</Badge>
            {email.urgency ? <Badge variant={urgencyVariant}>{email.urgency} urgency</Badge> : null}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold tracking-tight">{email.subject}</h2>
          </div>

          {email.summary || email.actionRequired ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {email.summary ? (
                <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Summary</p>
                  <p className="mt-3 text-sm leading-6">{email.summary}</p>
                </div>
              ) : null}
              {email.actionRequired ? (
                <div className="rounded-[1.5rem] bg-secondary/70 p-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">Action</p>
                  <p className="mt-3 text-sm leading-6">{email.actionRequired}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 flex-1 rounded-[1.5rem] bg-secondary/70 p-5">
            <p className="whitespace-pre-wrap text-sm leading-8 text-foreground">{email.snippet}</p>
          </div>
        </CardContent>
      </Card>

      <ReplyComposerDialog
        open={showReplyDialog}
        onOpenChange={setShowReplyDialog}
        recipient={recipient}
        subject={`Re: ${email.subject}`}
        initialPrompt={buildReplyPrompt(email)}
      />
    </>
  );
}
