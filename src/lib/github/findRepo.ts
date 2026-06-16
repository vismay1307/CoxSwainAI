import { corsair } from "@/server/corsair";

export async function findRepo(
  userId:string,
  repoName: string
) {
  const tenant=
  corsair.withTenant(userId)

  const repos =
    await tenant.github.api.repositories.list({});

  return repos.find(
    (repo) =>
      repo.name.toLowerCase() ===
      repoName.toLowerCase()
  );
}