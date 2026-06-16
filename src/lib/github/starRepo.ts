import { corsair } from "@/server/corsair";

export async function starRepo(
  userId:string,
  owner: string,
  repo: string
) {
  const tenant=
corsair.withTenant(userId)

  return tenant.github.api.repositories.star({
    owner,
    repo,
  });
}