export function isUpdateEventQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("move") ||
    lower.includes("reschedule")
  );
}