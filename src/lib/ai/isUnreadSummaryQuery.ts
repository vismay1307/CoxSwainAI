export function isUnreadSummaryQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "summarize unread"
    ) ||
    lower.includes(
      "summary of unread"
    ) ||
    lower.includes(
      "summarize my inbox"
    ) ||
    lower.includes(
      "summary of inbox"
    )
  );
}