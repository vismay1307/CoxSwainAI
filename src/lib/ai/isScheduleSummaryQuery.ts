export function isScheduleSummaryQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "summarize my week"
    ) ||
    lower.includes(
      "what does my week look like"
    ) ||
    lower.includes(
      "tomorrow schedule"
    ) ||
    lower.includes(
      "summarize my calendar"
    ) ||
    lower.includes(
      "give me tomorrow's schedule"
    )
  );
}