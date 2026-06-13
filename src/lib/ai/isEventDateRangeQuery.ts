export function isEventDateRangeQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("from") &&
    lower.includes("to")
  ) ||
  lower.includes("between") ||
  lower.includes("on ");
}