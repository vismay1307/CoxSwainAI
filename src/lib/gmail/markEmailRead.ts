import { corsair } from "@/server/corsair";

export async function markEmailRead(
  tenantId: string,
  emailId: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.gmail.api.messages.modify({
    id: emailId,
    removeLabelIds: ["UNREAD"],
  });
}