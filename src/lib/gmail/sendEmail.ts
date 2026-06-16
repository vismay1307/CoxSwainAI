import { corsair } from "@/server/corsair";
import { createRawEmail } from "@/lib/utils/createRawEmail";

export async function sendEmail(
  tenantId: string,
  to: string,
  subject: string,
  body: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  const raw =
    createRawEmail(
      to,
      subject,
      body
    );

  return tenant.gmail.api.messages.send({
    raw,
  });
}