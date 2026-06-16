import { corsair } from "@/server/corsair";

export async function listRepos(
  tenantId: string
) {
  const tenant =
    corsair.withTenant(tenantId);

  return tenant.github.api.repositories.list({});
}