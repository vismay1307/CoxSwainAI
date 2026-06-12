import { corsair } from "@/server/corsair";

export async function readEvents(
  maxResults = 20
) {
  const tenant = corsair.withTenant("default");

  const events =
    await tenant.googlecalendar.api.events.getMany({
      maxResults,
    });

  return events.items ?? [];
}