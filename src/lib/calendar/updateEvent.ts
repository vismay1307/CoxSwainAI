import { corsair } from "@/server/corsair";

export async function updateEvent(
  eventId: string,
  title: string,
  start: string,
  end: string
) {
  const tenant =
    corsair.withTenant("default");

  return tenant.googlecalendar.api.events.update({
    id: eventId,

    event: {
      summary: title,
      
      start: {
  dateTime: `${start}+05:30`,
},

end: {
  dateTime: `${end}+05:30`,
},
    },
  });
}