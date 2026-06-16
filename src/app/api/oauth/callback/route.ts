import { processOAuthCallback } from "corsair/oauth";

import { corsair } from "@/server/corsair";

export async function GET(
  request: Request
) {
  const url = new URL(request.url);

  const code =
    url.searchParams.get("code");

  const state =
    url.searchParams.get("state");

  if (!code || !state) {
    return Response.json(
      {
        error:
          "Missing code or state",
      },
      {
        status: 400,
      }
    );
  }

  const redirectUri =
    `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`;

  const result =
    await processOAuthCallback(
      corsair,
      {
        code,
        state,
        redirectUri,
      }
    );

  return Response.json(result);
}