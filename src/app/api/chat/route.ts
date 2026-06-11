import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { corsair } from "@/server/corsair";

export async function POST(req: Request) {
  const { message } = await req.json();

  const tenant = corsair.withTenant("default");

  const events = await tenant.googlecalendar.api.events.getMany({
    maxResults: 20,
  });

  const result = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are an AI calendar assistant.

User asked:
${message}

Calendar Events:
${JSON.stringify(events.items, null, 2)}

Answer the user's question based only on the calendar data.
`,
  });

  return Response.json({
    response: result.text,
  });
}