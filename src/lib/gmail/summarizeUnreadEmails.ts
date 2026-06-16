import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { corsair } from "@/server/corsair";
import { searchEmails } from "./searchEmails";

export async function summarizeUnreadEmails(count: number,userId:string) {
  const emails =
await searchEmails(
  "is:unread",
  userId,
  count
);
  const tenant =
  corsair.withTenant(userId)

  const detailedEmails =
    await Promise.all(
      (emails.messages ?? []).map(
        (email) =>
          tenant.gmail.api.messages.get({
            id: email.id!,
          })
      )
    );

  const result =
    await generateText({
      model: google(
        "gemini-2.5-flash"
      ),

      prompt: `
Summarize these unread emails.

Emails:
${JSON.stringify(
  detailedEmails,
  null,
  2
)}

Provide:
1. Important emails
2. Action items
3. Quick summary
`,
    });

  return result.text;
}