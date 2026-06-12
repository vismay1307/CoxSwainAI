import { corsair } from "@/server/corsair";

export async function listIssues(
  owner: string,
  repo: string
) {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.issues.list({
    owner,
    repo,
  });
}