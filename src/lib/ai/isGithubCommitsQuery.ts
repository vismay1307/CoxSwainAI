export function isGithubCommitsQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("commits") ||
    lower.includes("recent commits") ||
    lower.includes("show commits") ||
    lower.includes("list commits")
  );
}