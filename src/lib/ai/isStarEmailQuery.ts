export function isStarEmailQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("star") &&
    lower.includes("email")
  );
}