export function isBusiestDayQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "busiest day"
    ) ||
    lower.includes(
      "which day is busiest"
    )
  );
}