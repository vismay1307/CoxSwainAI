import { google } from "@ai-sdk/google";
import { generateText } from "ai";

type InboxEmail = {
  id?: string;
  subject?: string;
  from?: string;
  snippet?: string;
  threadId?: string;
  labelIds?: string[];
  internalDate?: string;
};

type CalendarEvent = {
  id?: string;
  summary?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
};

export async function generateInboxIntelligence(
  message: string,
  emails: InboxEmail[],
  events: CalendarEvent[]
) {
  const result = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are analyzing real Gmail and Calendar data for CoxswainAI.

User request:
${message}

Current date:
${new Date().toISOString()}

Use only the provided real data.
Do not invent emails, meetings, conflicts, or action items.

Gmail data:
${JSON.stringify(emails, null, 2)}

Calendar data:
${JSON.stringify(events, null, 2)}

Return a concise but useful response that matches the user request.

If the user asked for:
- inbox summary: include important emails, key topics, and action items.
- urgent emails: include deadlines, interviews, follow-ups, and anything action-required.
- requires a reply: identify emails that likely need a response and suggest the next step.
- catch me up: include inbox summary, important emails, upcoming meetings, scheduling conflicts, and recommended actions.
`,
  });

  return result.text;
}
