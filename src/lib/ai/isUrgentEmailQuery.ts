export function isUrgentEmailQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("urgent emails") ||
    lower.includes("show urgent") ||
    lower.includes("urgent mail") ||
    lower.includes("urgent inbox")
  );
}
