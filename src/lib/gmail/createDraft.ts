import { corsair } from "@/server/corsair";
import { createRawEmail } from "@/lib/utils/createRawEmail";

export async function createDraft(
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

  return tenant.gmail.api.drafts.create({
    draft: {
      message: {
        raw,
      },
    },
  });
}