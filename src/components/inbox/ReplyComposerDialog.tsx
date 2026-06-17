"use client";

import { useEffect, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/trpc/client";

type ReplyComposerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipient: string;
  subject: string;
  initialPrompt: string;
};

export default function ReplyComposerDialog({
  open,
  onOpenChange,
  recipient,
  subject,
  initialPrompt,
}: ReplyComposerDialogProps) {
  const [draft, setDraft] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const utils = api.useUtils();

  const sendEmailMutation = api.gmail.sendEmail.useMutation({
    onSuccess: async () => {
      await utils.gmail.readEmails.invalidate();
      onOpenChange(false);
    },
  });

  const createDraftMutation = api.gmail.createDraft.useMutation();

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function generateDraft() {
      setIsGenerating(true);
      setErrorMessage("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: initialPrompt,
          }),
        });

        const data = await response.json();

        if (!cancelled) {
          setDraft(data.response ?? "");
        }
      } catch {
        if (!cancelled) {
          setErrorMessage("Could not generate a reply right now.");
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    }

    void generateDraft();

    return () => {
      cancelled = true;
    };
  }, [initialPrompt, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(94vw,48rem)]">
        <DialogHeader>
          <DialogTitle>Generate reply</DialogTitle>
          <DialogDescription>
            AI creates a draft, you edit it, then send or save it with the existing Gmail integration.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
          <p className="font-medium">To</p>
          <p className="mt-1 text-muted-foreground">{recipient}</p>
          <p className="mt-4 font-medium">Subject</p>
          <p className="mt-1 text-muted-foreground">{subject}</p>
        </div>

        {isGenerating ? (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-5 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Generating a suggested reply...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {errorMessage}
          </div>
        ) : null}

        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-h-56"
          placeholder="Your generated reply will appear here."
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              createDraftMutation.mutate({
                to: recipient,
                subject,
                body: draft,
              })
            }
            disabled={!draft.trim() || createDraftMutation.isPending}
          >
            <Sparkles className="size-4" />
            Save draft
          </Button>
          <Button
            onClick={() =>
              sendEmailMutation.mutate({
                to: recipient,
                subject,
                body: draft,
              })
            }
            disabled={!draft.trim() || sendEmailMutation.isPending}
          >
            <Send className="size-4" />
            Send reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
