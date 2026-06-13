import { corsair } from "@/server/corsair";

export async function searchEvents(
  startDate: string,
  endDate: string
) {
  const tenant =
    corsair.withTenant("default");

  const events =
    await tenant.googlecalendar.api.events.getMany({
      timeMin:
        new Date(
          startDate
        ).toISOString(),

      timeMax:
        new Date(
          endDate +
            "T23:59:59"
        ).toISOString(),

      singleEvents: true,
    });

  return events.items ?? [];
}