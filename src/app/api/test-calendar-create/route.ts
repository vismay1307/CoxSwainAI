import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant = corsair.withTenant("default");

  try {
    const event = await tenant.googlecalendar.api.events.create({
      event: {
        summary: "Coxswain AI Test Event",
        start: {
          dateTime: "2026-06-12T19:00:00",
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: "2026-06-12T20:00:00",
          timeZone: "Asia/Kolkata",
        },
      },
    } as any);

    return Response.json(event);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error,
      },
      { status: 500 }
    );
  }
}