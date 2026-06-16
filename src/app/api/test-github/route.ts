// src/app/api/test-github/route.ts

import { listRepos } from "@/lib/github/listRepos";

export async function GET() {
  const repos =
    await listRepos(
      "default"
    );

  return Response.json(repos);
}