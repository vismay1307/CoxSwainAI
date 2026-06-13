export function isUpcomingEventsQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "upcoming events"
    ) ||
    lower.includes(
      "next meetings"
    ) ||
    lower.includes(
      "next meeting"
    ) ||
    lower.includes(
      "tomorrow events"
    ) ||
    lower.includes(
      "tomorrow's events"
    )
  );
}