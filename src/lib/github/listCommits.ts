import { corsair } from "@/server/corsair";

export async function listCommits(
  owner: string,
  repo: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.repositories.listCommits({
    owner,
    repo,
  });
}