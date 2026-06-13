import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateDraftEmail(
  message: string
) {
  const result =
    await generateText({
      model: google("gemini-2.5-flash"),

      prompt: `
Create a professional email draft.

User Request:
${message}

Return in this format:

Subject:
<subject>

Body:
<body>
`,
    });

  return result.text;
}