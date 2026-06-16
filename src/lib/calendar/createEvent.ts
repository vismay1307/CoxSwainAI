import { corsair } from "@/server/corsair";

export async function createEvent(
  tenantId: string,
  title: string,
  start: string,
  end: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.googlecalendar.api.events.create({
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