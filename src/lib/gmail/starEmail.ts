import { corsair } from "@/server/corsair";

export async function starEmail(
  tenantId: string,
  emailId: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.gmail.api.messages.modify({
    id: emailId,
    addLabelIds: ["STARRED"],
  });
}