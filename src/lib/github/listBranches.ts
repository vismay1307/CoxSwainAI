import { corsair } from "@/server/corsair";

export async function listBranches(
  owner: string,
  userId:string,
  repo: string
) {
  const tenant=
 corsair.withTenant(userId)
  return tenant.github.api.repositories.listBranches({
    owner,
    repo,
  });
}