import { corsair } from "@/server/corsair";

export async function listIssues(
  tenantId: string,
  owner: string,
  repo: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.github.api.issues.list({
    owner,
    repo,
  });
}