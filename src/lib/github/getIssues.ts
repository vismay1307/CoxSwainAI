import { corsair } from "@/server/corsair";

export async function getIssues(
  userId:string,
  owner: string,
  repo: string
) {
  const tenant=
corsair.withTenant(userId)

  return tenant.github.api.issues.list({
    owner,
    repo,
  });
}