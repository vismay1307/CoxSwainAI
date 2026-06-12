export function isGithubCommentQuery(
  message: string
) {
  const lower = message.toLowerCase();

  return (
    lower.includes("comment on issue") ||
    lower.includes("add comment") ||
    lower.includes("issue comment")
  );
}