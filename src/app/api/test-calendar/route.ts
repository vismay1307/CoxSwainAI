import { auth } from "@clerk/nextjs/server";
import { corsair } from "@/server/corsair";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const tenant = corsair.withTenant(userId);

  const events =
    await tenant.googlecalendar.api.events.getMany({
      maxResults: 10,
    });

  return Response.json(events);
}