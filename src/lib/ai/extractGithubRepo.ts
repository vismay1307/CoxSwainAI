export async function extractGithubRepo(
  message: string
) {
  const repoMatch =
    message.match(
      /(?:repository|repo|in|from)\s+([A-Za-z0-9._-]+)/i
    );

  return {
    repo: repoMatch?.[1]?.trim(),
  };
}