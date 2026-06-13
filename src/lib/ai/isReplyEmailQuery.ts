export function isReplyEmailQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("reply to")
  );
}