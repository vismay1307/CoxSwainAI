import { corsair } from "@/server/corsair";

export async function searchEmails(
  query: string,
  maxResults = 10
) {
  const tenant =
    corsair.withTenant("default");

  const result =
    await tenant.gmail.api.messages.list({
      q: query,
      maxResults,
    });

  console.log(result);

  return result;
}