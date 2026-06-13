import { corsair } from "@/server/corsair";

export async function markEmailRead(
  emailId: string
) {
  const tenant =
    corsair.withTenant("default");

  return tenant.gmail.api.messages.modify({
    id: emailId,
    removeLabelIds: ["UNREAD"],
  });

}