import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant = corsair.withTenant("default");

  // Cursor ko send ke baad hover karna
  type SendInput =
    Parameters<
      typeof tenant.gmail.api.messages.send
    >[0];

  return Response.json({
    ok: true,
  });
}