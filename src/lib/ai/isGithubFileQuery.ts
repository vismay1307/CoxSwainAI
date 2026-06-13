export function isGithubFileQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("readme") ||
    lower.includes("show readme") ||
    lower.includes("show file") ||
    lower.includes("read file")
  );
}