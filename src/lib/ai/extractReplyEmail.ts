export function extractReplyEmail(
  message: string
) {
  const match =
    message.match(
      /reply\s+to\s+latest\s+(.+?)\s+email\s+saying\s+(.+)/i
    );

  return {
    sender:
      match?.[1]?.trim(),

    reply:
      match?.[2]?.trim(),
  };
}