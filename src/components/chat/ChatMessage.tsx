import { Bot, Sparkles, User2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { ChatMessageRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ChatMessageProps = ChatMessageRecord;

export default function ChatMessage({
  role,
  content,
  timestamp,
  toolResults,
}: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-4", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant ? (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
          <Bot className="size-5" />
        </div>
      ) : null}

      <div className={cn("max-w-3xl space-y-3", isAssistant ? "items-start" : "items-end")}>
        <div
          className={cn(
            "rounded-[1.75rem] border px-5 py-4 shadow-soft",
            isAssistant
              ? "border-white/80 bg-white text-foreground"
              : "border-primary/20 bg-primary text-primary-foreground"
          )}
        >
          <div className="mb-3 flex items-center gap-2">
            <Badge variant={isAssistant ? "primary" : "outline"}>
              {isAssistant ? <Sparkles className="mr-1 size-3" /> : <User2 className="mr-1 size-3" />}
              {isAssistant ? "CoxswainAI" : "You"}
            </Badge>
            <span className={cn("text-xs", isAssistant ? "text-muted-foreground" : "text-blue-100")}>
              {timestamp}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7">{content}</p>
        </div>

        {toolResults?.length ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {toolResults.map((result) => (
              <Card key={result.title} className="bg-white">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {result.title}
                  </p>
                  {result.metric ? <p className="mt-3 text-2xl font-semibold">{result.metric}</p> : null}
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>

      {!isAssistant ? (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft">
          <User2 className="size-5" />
        </div>
      ) : null}
    </div>
  );
}
