import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { parseJsonResponse } from "@/lib/utils/parseJson";

export async function extractMultiAction(
  message: string
) {
  const currentDate =
    new Date().toISOString();

  const extraction = await generateText({
    model: google("gemini-2.5-flash"),

    prompt: `
Extract BOTH email and calendar details.

Current Date:
${currentDate}

Message:
${message}

Return ONLY valid JSON.

Example:

{
  "email": {
    "to": "abc@gmail.com",
    "subject": "Interview Discussion",
    "body": "Hello, let's discuss the interview."
  },

  "calendar": {
    "title": "Interview",
    "start": "2026-06-12T17:00:00",
    "end": "2026-06-12T18:00:00"
  }
}
`,
  });

  return parseJsonResponse(
    extraction.text
  );
}