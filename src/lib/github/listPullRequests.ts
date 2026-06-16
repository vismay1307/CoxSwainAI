import { corsair } from "@/server/corsair";

export async function listPullRequests(
  tenantId: string,
  owner: string,
  repo: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.github.api.pullRequests.list({
    owner,
    repo,
  });
}