export async function extractGithubRepo(
  message: string
) {
  const repoMatch =
    message.match(
      /repository\s+([^\n]+)/i
    );

  return {
    repo: repoMatch?.[1]?.trim(),
  };
}