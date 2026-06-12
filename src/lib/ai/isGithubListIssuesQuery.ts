export function isGithubListIssuesQuery(
  message: string
) {
  const lower = message.toLowerCase();

  return (
    lower.includes("show issues") ||
    lower.includes("list issues") ||
    lower.includes("github issues")
  );
}