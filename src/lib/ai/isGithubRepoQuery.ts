export function isGithubRepoQuery(
  message: string
) {
  const lower = message.toLowerCase();

  return (
    lower.includes("repositories") ||
    lower.includes("repos") ||
    lower.includes("github repos") ||
    lower.includes("github repositories")
  );
}