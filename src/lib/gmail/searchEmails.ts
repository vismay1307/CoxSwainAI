import { corsair } from "@/server/corsair";

export async function searchEmails(
  tenantId: string,
  query: string,
  maxResults = 10
) {
  const tenant =
    corsair.withTenant(tenantId);

  const result =
    await tenant.gmail.api.messages.list({
      q: query,
      maxResults,
    });

  return result;
}