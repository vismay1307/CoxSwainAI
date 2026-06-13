import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { parseJsonResponse } from "@/lib/utils/parseJson";

export async function extractEventDateRange(
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

Extract the date range from the user message.

Message:
${message}

Return ONLY valid JSON.

Example:

{
  "startDate": "2026-06-15",
  "endDate": "2026-06-17"
}
`,
    });

  return parseJsonResponse(
    result.text
  );
}