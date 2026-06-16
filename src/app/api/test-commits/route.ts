// src/app/api/test-commits/route.ts

import { listCommits } from "@/lib/github/listCommits";

export async function GET() {
  const commits =
    await listCommits(
      "default",
      "chaicodehq",
      "js-conditionals-vismay1307"
    );

  return Response.json(commits);
}