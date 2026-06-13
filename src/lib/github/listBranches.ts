import { corsair } from "@/server/corsair";

export async function listBranches(
  owner: string,
  repo: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.repositories.listBranches({
    owner,
    repo,
  });
}