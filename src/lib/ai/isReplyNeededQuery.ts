export function isReplyNeededQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "requires a reply"
    ) ||
    lower.includes(
      "what requires a reply"
    ) ||
    lower.includes(
      "needs a reply"
    ) ||
    lower.includes(
      "reply needed"
    )
  );
}
