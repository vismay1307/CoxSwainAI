import { corsair } from "@/server/corsair";

export async function starRepo(
  owner: string,
  repo: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.repositories.star({
    owner,
    repo,
  });
}