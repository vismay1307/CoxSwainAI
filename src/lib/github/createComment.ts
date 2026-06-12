import { corsair } from "@/server/corsair";

export async function createComment(
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.issues.createComment({
    owner,
    repo,
 issueNumber,
    body,
  });
}