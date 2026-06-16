import { processWebhook } from "corsair";
import { corsair } from "@/server/corsair";

export async function POST(request: Request) {
  console.log("🔥 WEBHOOK HIT");

  const headers = Object.fromEntries(
    request.headers.entries()
  );

  const body = request.headers
    .get("content-type")
    ?.includes("application/json")
    ? await request.json()
    : await request.text();

  console.log("HEADERS:", headers);

  const tenantId =
    new URL(request.url)
      .searchParams.get("tenantId") ??
    undefined;

  const result =
    await processWebhook(
      corsair,
      headers,
      body,
      {
        tenantId,
      }
    );

  console.log(
    "WEBHOOK RESULT:",
    result
  );

  return Response.json(result);
}