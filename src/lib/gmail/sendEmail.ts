import { corsair } from "@/server/corsair";
import { createRawEmail } from "@/lib/utils/createRawEmail";

export async function sendEmail(
  to: string,
  subject: string,
  body: string
) {
  const tenant = corsair.withTenant("default");

  const raw = createRawEmail(
    to,
    subject,
    body
  );

  return tenant.gmail.api.messages.send({
    raw,
  });
}