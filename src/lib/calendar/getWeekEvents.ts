import { corsair } from "@/server/corsair";

export async function getWeekEvents(
  tenantId: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  const events =
    await tenant.googlecalendar.db.events.list({
      limit: 20,
    });

  return events;
}