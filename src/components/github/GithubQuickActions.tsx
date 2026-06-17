"use client";

import { useState } from "react";
import { Loader2, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type GithubQuickActionsProps = {
  repoName: string;
  owner: string;
};

type ActionMode = "issue" | "comment" | null;

export default function GithubQuickActions({
  repoName,
  owner,
}: GithubQuickActionsProps) {
  const [mode, setMode] = useState<ActionMode>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState("");

  async function runPrompt(prompt: string) {
    setRunning(true);
    setResult("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
        }),
      });

      const data = await response.json();
      setResult(data.response ?? "Action completed.");
      setMode(null);
      setTitle("");
      setBody("");
      setIssueNumber("");
    } catch {
      setResult("GitHub quick action failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Create issues, add comments, or star the repository without leaving the workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" onClick={() => setMode("issue")} disabled={!repoName || !owner || running}>
              <Sparkles className="size-4" />
              Create issue
            </Button>
            <Button variant="outline" onClick={() => setMode("comment")} disabled={!repoName || !owner || running}>
              <Sparkles className="size-4" />
              Comment on issue
            </Button>
            <Button
              onClick={() => void runPrompt(`star repository ${repoName}`)}
              disabled={!repoName || !owner || running}
            >
              {running ? <Loader2 className="size-4 animate-spin" /> : <Star className="size-4" />}
              Star repository
            </Button>
          </div>

          {result ? <div className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">{result}</div> : null}
        </CardContent>
      </Card>

      <Dialog open={mode !== null} onOpenChange={(open) => !open && setMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "issue" ? "Create issue" : "Comment on issue"}</DialogTitle>
            <DialogDescription>
              These actions are routed through the existing AI command endpoint and GitHub integration.
            </DialogDescription>
          </DialogHeader>

          {mode === "issue" ? (
            <div className="space-y-4">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Issue title" />
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Describe the issue" />
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                value={issueNumber}
                onChange={(event) => setIssueNumber(event.target.value)}
                placeholder="Issue number"
              />
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Comment body" />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setMode(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                void runPrompt(
                  mode === "issue"
                    ? `create github issue in ${repoName} with title ${title} and body ${body}`
                    : `comment on issue ${issueNumber} in ${repoName} with ${body}`
                )
              }
              disabled={running || (mode === "issue" ? !title.trim() : !issueNumber.trim() || !body.trim())}
            >
              {running ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Run action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
