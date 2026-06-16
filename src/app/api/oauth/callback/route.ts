import { processOAuthCallback } from "corsair/oauth";
import { corsair } from "@/server/corsair";

/**
 * FIX: After OAuth completes, redirect the user to /dashboard
 * instead of leaving them stranded on the raw API route with JSON output.
 *
 * Previous bug: `return Response.json(result)` — user saw raw JSON in browser.
 * Fix: redirect on success, redirect to error page on failure.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Missing params — bad request
  if (!code || !state) {
    const errorUrl = new URL("/dashboard", url.origin);
    errorUrl.searchParams.set("oauth_error", "missing_params");
    return Response.redirect(errorUrl.toString(), 302);
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`;

  try {
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri,
    });

    // Success — redirect to dashboard with a success signal
    // The dashboard or integrations page can read ?oauth_success=gmail etc.
    const successUrl = new URL("/dashboard", url.origin);
    successUrl.searchParams.set("oauth_success", result.plugin ?? "true");
    return Response.redirect(successUrl.toString(), 302);

  } catch (err) {
    console.error("[oauth/callback] processOAuthCallback failed:", err);

    // Failure — redirect back to dashboard with error signal
    const errorUrl = new URL("/dashboard", url.origin);
    errorUrl.searchParams.set("oauth_error", "callback_failed");
    return Response.redirect(errorUrl.toString(), 302);
  }
}