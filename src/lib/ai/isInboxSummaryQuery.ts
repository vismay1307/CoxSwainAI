export function isInboxSummaryQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "summarize my inbox"
    ) ||
    lower.includes(
      "inbox summary"
    ) ||
    lower.includes(
      "summarize inbox"
    )
  );
}
