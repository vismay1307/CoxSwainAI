export function isGithubBranchesQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("branches") ||
    lower.includes("show branches") ||
    lower.includes("list branches")
  );
}