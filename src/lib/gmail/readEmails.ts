import { corsair } from "@/server/corsair";

export async function readEmails(
  tenantId: string,
  maxResults = 5
) {
 const tenant =
  corsair.withTenant(tenantId);

  const emails =
    await tenant.gmail.db.messages.list({
      limit: maxResults,
    });

  return emails.map((email) => ({
    id:
      email.entity_id,

    subject:
      email.data?.subject ??
      "No Subject",

    from:
      email.data?.from ??
      "Unknown Sender",

    snippet:
      email.data?.snippet ?? "",
  }));
}