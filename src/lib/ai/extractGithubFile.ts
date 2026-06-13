export function extractGithubFile(
  message: string
) {
  const repoMatch =
    message.match(
      /(?:from|in)\s+([A-Za-z0-9_-]+)/i
    );

  return {
    repo: repoMatch?.[1],
    path: "README.md",
  };
}