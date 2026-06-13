import { corsair } from "@/server/corsair";

export async function getWeekEvents() {
  const tenant =
    corsair.withTenant("default");

  const now = new Date();

  const weekEnd =
    new Date(now);

  weekEnd.setDate(
    now.getDate() + 7
  );

  const events =
    await tenant.googlecalendar.api.events.getMany({
      timeMin:
        now.toISOString(),

      timeMax:
        weekEnd.toISOString(),

      singleEvents: true,

      timeZone:
        "Asia/Kolkata",
    });

  return events.items ?? [];
}