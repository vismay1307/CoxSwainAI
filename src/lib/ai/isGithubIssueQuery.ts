export function isGithubIssueQuery(
  message: string
) {
  const lower = message.toLowerCase();

  return (
    lower.includes("create issue") ||
    lower.includes("github issue") ||
    lower.includes("open issue")
  );
}