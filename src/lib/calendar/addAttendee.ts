import { corsair } from "@/server/corsair";

export async function addAttendee(
  userId:string,
  eventId: string,
  eventTitle: string,
  start: string,
  end: string,
  email: string
) {
  const tenant =
   corsair.withTenant(userId)

  return tenant.googlecalendar.api.events.update({
    id: eventId,

    event: {
      summary: eventTitle,

      start: {
        dateTime: start,
        timeZone: "Asia/Kolkata",
      },

      end: {
        dateTime: end,
        timeZone: "Asia/Kolkata",
      },

      attendees: [
        {
          email,
        },
      ],
    },
  });
}