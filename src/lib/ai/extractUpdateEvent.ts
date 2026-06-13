import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { parseJsonResponse } from "@/lib/utils/parseJson";

export async function extractUpdateEvent(
  message: string
) {
  const currentDate =
    new Date().toISOString();

  const result =
    await generateText({
      model: google(
        "gemini-2.5-flash"
      ),

      prompt: `
Current Date:
${currentDate}

Extract:

1. Event title
2. New start time
3. New end time

Message:
${message}

Return ONLY JSON.

Example:

{
  "title": "Hackathon Demo",
  "start": "2026-06-20T18:00:00",
  "end": "2026-06-20T19:00:00"
}
`,
    });

  return parseJsonResponse(
    result.text
  );
}