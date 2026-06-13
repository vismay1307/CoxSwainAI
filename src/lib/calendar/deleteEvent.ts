import { corsair } from "@/server/corsair";

export async function deleteEvent(
  eventId: string
) {
  const tenant =
    corsair.withTenant("default");


  return tenant.googlecalendar.api.events.delete({
    id: eventId,
  });
}