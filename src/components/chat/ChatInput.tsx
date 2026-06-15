"use client";

import { useState } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type ChatInputProps = {
  onSend: (message: string) => Promise<void> | void;
  loading?: boolean;
};

export default function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const trimmed = message.trim();

    if (!trimmed || loading) {
      return;
    }

    setMessage("");
    await onSend(trimmed);
  };

  return (
    <div className="rounded-[1.75rem] border border-white/80 bg-white p-3 shadow-panel">
      <label htmlFor="chat-input" className="sr-only">
        Ask CoxswainAI
      </label>
      <Textarea
        id="chat-input"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Ask CoxswainAI to summarize, draft, schedule, or coordinate."
        className="min-h-24 resize-none border-0 p-2 shadow-none focus-visible:ring-0"
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void handleSubmit();
          }
        }}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" className="rounded-full">
          <Paperclip className="size-4" />
          Attach context
        </Button>
        <Button type="button" size="icon" aria-label="Send message" onClick={() => void handleSubmit()} disabled={loading}>
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}
