import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant =
    corsair.withTenant("default");

  const email =
    await tenant.gmail.api.messages.get({
      id:
        "19ebf13e6743b0d3",
    });

  console.log(email);

  return Response.json(email);
}