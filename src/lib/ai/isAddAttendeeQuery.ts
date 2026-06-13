export function isAddAttendeeQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("add") &&
    lower.includes("to")
  ) ||
  lower.includes("invite");
}