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

  console.log(
    "EMAIL COUNT:",
    emails.length
  );

  console.log(
    "FIRST EMAIL:",
    emails[0]
  );

  return emails.map((email) => ({
    id: email.entity_id,
    threadId: email.data?.threadId ?? email.entity_id,
    subject:
      email.data?.subject ??
      "No Subject",
    from:
      email.data?.from ??
      "Unknown Sender",
    snippet:
      email.data?.snippet ?? "",
    labelIds:
      email.data?.labelIds ?? [],
    internalDate:
      email.data?.internalDate ?? null,
    unread: Array.isArray(email.data?.labelIds)
      ? email.data.labelIds.includes("UNREAD")
      : false,
    starred: Array.isArray(email.data?.labelIds)
      ? email.data.labelIds.includes("STARRED")
      : false,
  }));
}
