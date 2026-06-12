import { corsair } from "@/server/corsair";

export async function createEvent(
  title: string,
  start: string,
  end: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.googlecalendar.api.events.create({
    event: {
      summary: title,

      start: {
        dateTime: start,
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: end,
        timeZone: "Asia/Kolkata",
      },
    },
  });
}