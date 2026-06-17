import { processWebhook } from "corsair";
import { corsair } from "@/server/corsair";

export async function POST(request: Request) {
  console.log("🔥 WEBHOOK HIT");

  const headers = Object.fromEntries(request.headers.entries());
  const rawBody = await request.json();

  console.log("Raw body:", JSON.stringify(rawBody, null, 2));

  const tenantId =
    new URL(request.url).searchParams.get("tenantId") ?? undefined;

  const result = await processWebhook(corsair, headers, rawBody, { tenantId });

  console.log("processWebhook result:", result);

  // 200 return ZAROORI hai
  return Response.json({ success: true }, { status: 200 });
}