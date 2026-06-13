import { corsair } from "@/server/corsair";
import { createRawEmail } from "@/lib/utils/createRawEmail";

export async function replyToEmail(
  to: string,
  subject: string,
  body: string,
  threadId: string
) {
  const tenant =
    corsair.withTenant("default");

  const raw =
    createRawEmail(
      to,
      `Re: ${subject}`,
      body
    );

  return tenant.gmail.api.messages.send({
    raw,
    threadId,
  });
}