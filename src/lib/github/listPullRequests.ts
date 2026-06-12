import { corsair } from "@/server/corsair";

export async function listPullRequests(
  owner: string,
  repo: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.pullRequests.list({
    owner,
    repo,
  });
}