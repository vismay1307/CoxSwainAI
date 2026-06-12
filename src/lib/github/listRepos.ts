import { corsair } from "@/server/corsair";

export async function listRepos() {
  const tenant = corsair.withTenant("default");

  return tenant.github.api.repositories.list({});
}