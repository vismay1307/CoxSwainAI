import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  const result = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: "Say hello from Gemini",
  });

  return Response.json({
    text: result.text,
  });
}