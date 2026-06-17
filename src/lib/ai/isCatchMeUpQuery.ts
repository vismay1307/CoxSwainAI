export function isCatchMeUpQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("catch me up") ||
    lower.includes("catch me up on") ||
    lower.includes("what did i miss")
  );
}
