import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant = corsair.withTenant("default");

  console.log(
    tenant.github.api.repositories.getContent
  );

  return Response.json({
    ok: true,
  });
}