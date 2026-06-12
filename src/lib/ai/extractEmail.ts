import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { parseJsonResponse } from "@/lib/utils/parseJson";

export async function extractEmail(
  message: string
) {
  const extraction = await generateText({
    model: google("gemini-2.5-flash"),

    prompt: `
Extract email details from the message.

Message:
${message}

Return ONLY valid JSON.

Example:

{
  "to": "abc@gmail.com",
  "subject": "Availability Update",
  "body": "I am available tomorrow."
}
`,
  });

  return parseJsonResponse(
    extraction.text
  );
}