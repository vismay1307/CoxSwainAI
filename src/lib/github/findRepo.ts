import { corsair } from "@/server/corsair";

export async function findRepo(
  repoName: string
) {
  const tenant = corsair.withTenant("default");

  const repos =
    await tenant.github.api.repositories.list({});

  return repos.find(
    (repo) =>
      repo.name.toLowerCase() ===
      repoName.toLowerCase()
  );
}