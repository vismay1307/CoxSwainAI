import { corsair } from "@/server/corsair";

export async function listCommits(
  tenantId: string,
  owner: string,
  repo: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.github.api.repositories.listCommits({
    owner,
    repo,
  });
}