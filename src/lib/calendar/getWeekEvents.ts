import { corsair } from "@/server/corsair";

export async function getWeekEvents() {
  const tenant =
    corsair.withTenant("default");

  const events =
    await tenant.googlecalendar.db.events.list({
      limit: 1,
    });

  console.log(
    "DB EVENT SAMPLE:",
    JSON.stringify(events[0], null, 2)
  );

  return events;
}