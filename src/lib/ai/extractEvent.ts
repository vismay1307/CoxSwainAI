import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { parseJsonResponse } from "@/lib/utils/parseJson";

export async function extractEvent(
  message: string
) {
  const currentDate =
    new Date().toISOString();

  const extraction = await generateText({
    model: google("gemini-2.5-flash"),

    prompt: `
Extract calendar event details from this message.

Current Date:
${currentDate}

Message:
${message}

Today's timezone is Asia/Kolkata.

Return ONLY valid JSON.

Example:

{
  "title": "Interview",
  "start": "2026-06-12T19:00:00",
  "end": "2026-06-12T20:00:00"
}
`,
  });

  return parseJsonResponse(
    extraction.text
  );
}