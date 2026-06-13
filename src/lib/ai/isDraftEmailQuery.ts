export function isDraftEmailQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return lower.includes("draft");
}