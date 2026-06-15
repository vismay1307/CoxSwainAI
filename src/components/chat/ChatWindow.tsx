"use client";

import { useEffect, useRef } from "react";

import ChatMessage from "@/components/chat/ChatMessage";
import TypingIndicator from "@/components/chat/TypingIndicator";
import type { ChatMessageRecord } from "@/lib/mock-data";

type ChatWindowProps = {
  messages: ChatMessageRecord[];
  isTyping?: boolean;
};

export default function ChatWindow({
  messages,
  isTyping,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, isTyping]);

  return (
    <div className="flex h-full flex-col gap-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} {...message} />
      ))}
      {isTyping ? <TypingIndicator /> : null}
      <div ref={bottomRef} />
    </div>
  );
}
