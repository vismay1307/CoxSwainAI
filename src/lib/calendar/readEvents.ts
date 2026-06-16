import { corsair } from "@/server/corsair";

export async function readEvents(
  userId:string,
  maxResults = 20
) {
  const tenant=
  corsair.withTenant(userId)

  const events =
    await tenant.googlecalendar.api.events.getMany({
      
      maxResults,
    });

  return events.items ?? [];
}