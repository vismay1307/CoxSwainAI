"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  buildToolCardsFromChatResponse,
  type ChatApiResponse,
} from "@/lib/command-center";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [response, setResponse] =
    useState("");

  const [cards, setCards] = useState<any[]>(
    []
  );

  const [actions, setActions] = useState<
    any[]
  >([]);

  async function runCommand(
    command?: string
  ) {
    const message = command ?? query;

    if (!message.trim()) return;

    try {
      setLoading(true);

      setCards([]);
      setActions([]);
      setResponse("");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await res.json();

      const payload =
        data as ChatApiResponse;

      const artifacts =
        buildToolCardsFromChatResponse(
          payload,
          message
        );

      setCards(artifacts.cards ?? []);

      setActions(
        artifacts.actions ?? []
      );

      setResponse(
  artifacts.cards?.length
    ? ""
    : (
        payload.response ??
        "No response returned."
      )
);
    } catch {
      setResponse(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(
      e: KeyboardEvent
    ) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      const isShortcut =
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k";

      if (!isShortcut) return;

      e.preventDefault();

      setOpen((prev) => !prev);
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="mx-auto mt-20 w-full max-w-3xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">
                Coxswain Command Palette
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Gmail · Calendar · GitHub
              </p>
            </div>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="rounded-xl p-2 hover:bg-secondary"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* SEARCH */}

          <div className="p-6">
            <div className="flex gap-3">
              <input
                autoFocus
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    runCommand();
                  }
                }}
                placeholder="Ask CoxswainAI anything..."
                className="flex-1 rounded-2xl border bg-white px-5 py-4 outline-none focus:border-primary"
              />

              <button
                onClick={() =>
                  runCommand()
                }
                className="rounded-2xl bg-primary px-6 text-white hover:opacity-90"
              >
                Run
              </button>
            </div>

            {/* QUICK ACTIONS */}

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Show unread emails",
                "Show today's meetings",
                "List GitHub repos",
                "Summarize my inbox",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    runCommand(item);
                  }}
                  className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-secondary"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* LOADING */}

            {loading && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-secondary p-4">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">
                  CoxswainAI is thinking...
                </span>
              </div>
            )}

            {/* RESULTS */}

            {!loading &&
              (cards.length > 0 ||
                response) && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="font-medium">
                      Results
                    </span>
                  </div>

                  {!cards.length ? (
                    <div className="rounded-3xl border bg-gradient-to-br from-secondary to-white p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                        {response}
                      </p>
                    </div>
                  ) : null}

                  {/* TOOL CARDS */}

                  {cards.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {cards.map((card, index) => (
                        <div key={index} className="rounded-2xl border bg-white p-4">
                          <p className="text-sm font-semibold">{card.title}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
                          {Array.isArray(card.fields) && card.fields.length > 0 ? (
                            <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                              {card.fields.map((field: any) => (
                                <div key={`${field.label}-${field.value}`} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                                  <span>{field.label}</span>
                                  <span className="text-foreground">{field.value}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ACTIONS */}

                  {actions.length >
                    0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {actions.map(
                        (
                          action,
                          index
                        ) => (
                          <button
                            key={index}
                            onClick={() =>
                              runCommand(
                                action.prompt
                              )
                            }
                            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-secondary"
                          >
                            {
                              action.label
                            }
                            <ArrowRight className="size-3" />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

            <div className="mt-6 text-xs text-muted-foreground">
              Press Ctrl + K to open • Esc to
              close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
