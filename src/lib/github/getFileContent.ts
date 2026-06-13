import { corsair } from "@/server/corsair";

export async function getFileContent(
  owner: string,
  repo: string,
  path: string
) {
  const tenant = corsair.withTenant("default");

  const file =
    await tenant.github.api.repositories.getContent({
      owner,
      repo,
      path,
    });

  if (
    !Array.isArray(file) &&
    file.type === "file" &&
    file.encoding === "base64"
  ) {
    return Buffer.from(
      file.content ?? "",
      "base64"
    ).toString("utf-8");
  }

  return file;
}