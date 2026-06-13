export function isMeetingCountQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "how many meetings"
    ) ||
    lower.includes(
      "how many events"
    )
  );
}