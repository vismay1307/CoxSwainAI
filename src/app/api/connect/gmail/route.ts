import { auth } from "@clerk/nextjs/server";
import { generateOAuthUrl } from "corsair/oauth";

import { corsair } from "@/server/corsair";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const redirectUri =
    `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`;

  const result =
    await generateOAuthUrl(
      corsair,
      "gmail",
      {
        tenantId: userId,
        redirectUri,
      }
    );

  return Response.redirect(result.url);
}