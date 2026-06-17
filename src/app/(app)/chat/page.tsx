"use client";

import { startTransition, useState } from "react";
import { MessageSquareQuote, Sparkles } from "lucide-react";

import ChatInput from "@/components/chat/ChatInput";
import ChatWindow from "@/components/chat/ChatWindow";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import PageContainer from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import type { ChatMessageRecord } from "@/types/chat";
import { starterPrompts } from "../../../../src/lib/chat-prompts";
import { buildToolCardsFromChatResponse, type ChatApiResponse } from "@/lib/command-center";

export default function ChatPage() {
 const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSend(message: string) {
    setErrorMessage("");

    const userMessage: ChatMessageRecord = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    };

    startTransition(() => {
      setMessages((current) => [...current, userMessage]);
    });

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      const payload = data as ChatApiResponse;
      const artifacts = buildToolCardsFromChatResponse(payload, message);

      const assistantMessage: ChatMessageRecord = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: payload.response ?? "No response returned from the assistant.",
        timestamp: new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
        route: artifacts.route,
        toolResults: artifacts.cards,
        actions: artifacts.actions,
      };

      startTransition(() => {
        setMessages((current) => [...current, assistantMessage]);
      });
    } catch {
      setErrorMessage("Chat is temporarily unavailable. You can still browse the other workspaces.");
      startTransition(() => {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            route: "general",
            content:
              "I could not reach the chat route just now. The frontend is still wired correctly, so try again once the backend route is available.",
            timestamp: new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date()),
            actions: [
              {
                label: "Try Gmail summary",
                prompt: "Summarize my unread important emails.",
              },
              {
                label: "Check my schedule",
                prompt: "What are my upcoming meetings today?",
              },
            ],
          },
        ]);
      });
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <PageContainer className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <Card className="h-fit bg-white">
        <CardHeader>
          <CardTitle>Conversation history</CardTitle>
          <CardDescription>Quick access to your common AI workflows.</CardDescription>
        </CardHeader>
<CardContent>
  <div className="rounded-[1.5rem] border border-border bg-secondary/60 p-4">
    <p className="text-sm font-semibold">
      No saved conversations yet
    </p>

    <p className="mt-2 text-sm text-muted-foreground">
      Start chatting with CoxswainAI to build your workspace history.
    </p>
  </div>
</CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Badge variant="primary">
                <Sparkles className="mr-1 size-3" />
                AI cockpit
              </Badge>
              <Badge variant="outline">Connected to `/api/chat`</Badge>
            </div>
            <CardTitle className="mt-2">ChatGPT-style command flow, tuned for operators</CardTitle>
            <CardDescription>
              Ask CoxswainAI to summarize, schedule, draft, or coordinate across the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SuggestedPrompts
  prompts={starterPrompts}
  onSelect={(prompt) => void handleSend(prompt)}
/>
          </CardContent>
        </Card>

        <Card className="min-h-[42rem] bg-white">
          <CardContent className="flex h-full flex-col gap-6 p-6">
            <div className="flex items-center gap-3 rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
              <MessageSquareQuote className="size-4 text-primary" />
              Command routing already uses the existing chat route. The frontend adds result cards and suggested follow-up actions.
            </div>
            {errorMessage ? <ErrorState description={errorMessage} /> : null}
            <div className="min-h-[26rem] flex-1">
              <ChatWindow messages={messages} isTyping={isTyping} onAction={(prompt) => void handleSend(prompt)} />
            </div>
            <ChatInput onSend={handleSend} loading={isTyping} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
