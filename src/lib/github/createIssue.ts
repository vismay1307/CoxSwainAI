import { corsair } from "@/server/corsair";

export async function createIssue(
  userId:string,
  owner: string,
  repo: string,
  title: string,
  body: string
) {
  const tenant=
 corsair.withTenant(userId)

  return tenant.github.api.issues.create({
    owner,
    repo,
    title,
    body,
  });
}