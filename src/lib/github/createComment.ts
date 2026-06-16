import { corsair } from "@/server/corsair";

export async function createComment(
  userId:string,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
) {
  const tenant=
 corsair.withTenant(userId)

  return tenant.github.api.issues.createComment({
    
    owner,
    repo,
 issueNumber,
    body,
  });
}