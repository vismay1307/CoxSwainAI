import { corsair } from "@/server/corsair";

export async function getUpcomingEvents(
  maxResults = 10
) {
  const tenant =
    corsair.withTenant("default");

  const now =
    new Date().toISOString();

const events =
  await tenant.googlecalendar.api.events.getMany({
    maxResults,
    timeMin: now,
    singleEvents: true,
    timeZone: "Asia/Kolkata",
  });

console.log(
  "UPCOMING EVENTS COUNT:",
  events.items?.length
);

return events.items ?? [];


}