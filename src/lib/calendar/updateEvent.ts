import { corsair } from "@/server/corsair";

function normalizeDateTime(
  value: string
) {
  const trimmed =
    value.trim();

  if (
    /[zZ]$/.test(trimmed) ||
    /[+-]\d{2}:\d{2}$/.test(trimmed)
  ) {
    return trimmed;
  }

  return `${trimmed}+05:30`;
}

export async function updateEvent(
  tenantId: string,
  eventId: string,
  title: string,
  start: string,
  end: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  const payload = {
    summary: title,
    start: {
      dateTime: normalizeDateTime(start),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: normalizeDateTime(end),
      timeZone: "Asia/Kolkata",
    },
  };

  console.log("CALENDAR PAYLOAD", payload);

  return tenant.googlecalendar.api.events.update({
    id: eventId,
    event: payload,
  });
}
