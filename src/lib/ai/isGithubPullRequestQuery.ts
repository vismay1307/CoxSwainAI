export function isGithubPullRequestQuery(
  message: string
) {
  const lower = message.toLowerCase();

  return (
    lower.includes("pull request") ||
    lower.includes("pull requests") ||
    lower.includes("show prs") ||
    lower.includes("show pull requests") ||
    lower.includes("list pull requests")
  );
}