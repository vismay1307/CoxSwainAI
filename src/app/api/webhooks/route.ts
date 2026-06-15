import { processWebhook } from "corsair";

import { corsair } from "@/server/corsair";

export async function POST(
  request: Request
) {
  const body =
    await request.text();

  const headers =
    Object.fromEntries(
      request.headers.entries()
    );

  const result =
    await processWebhook(
      corsair,
      headers,
      body,
      {
        tenantId:
          "default",
      }
    );

 return new Response(
  JSON.stringify(result),
  {
    status: 200,
    headers: {
      "Content-Type":
        "application/json",
    },
  }
);
}