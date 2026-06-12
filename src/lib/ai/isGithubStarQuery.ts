export function isGithubStarQuery(
  message: string
) {
  const lower = message.toLowerCase();

  return (
    lower.includes("star repo") ||
    lower.includes("star repository")
  );
}