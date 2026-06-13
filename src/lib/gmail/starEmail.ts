import { corsair } from "@/server/corsair";

export async function starEmail(
  emailId: string
) {
  const tenant =
    corsair.withTenant("default");

  return tenant.gmail.api.messages.modify({
    id: emailId,
    addLabelIds: ["STARRED"],
  });
}