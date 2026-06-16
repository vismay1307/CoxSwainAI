import { corsair } from "@/server/corsair";

export async function deleteEvent(
  tenantId: string,
  eventId: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.googlecalendar.api.events.delete({
    id: eventId,
  });
}