import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant = corsair.withTenant("default");

  console.log(
    Object.keys(tenant.googlecalendar.api.events)
  );

  return Response.json({
    ok: true,
  });
}