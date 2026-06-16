import { processWebhook } from "corsair";
import { corsair } from "@/server/corsair";

export async function POST(
  request: Request
) {
  const headers =
    Object.fromEntries(
      request.headers.entries()
    );

  const body =
    request.headers
      .get("content-type")
      ?.includes("application/json")
      ? await request.json()
      : await request.text();

  const tenantId =
    new URL(request.url)
      .searchParams.get(
        "tenantId"
      ) ?? undefined;

  const result =
    await processWebhook(
      corsair,
      headers,
      body,
      {
        tenantId,
      }
    );

  return Response.json(
    result
  );
}