import { corsair } from "@/server/corsair";

export async function createIssue(
  owner: string,
  repo: string,
  title: string,
  body: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.issues.create({
    owner,
    repo,
    title,
    body,
  });
}