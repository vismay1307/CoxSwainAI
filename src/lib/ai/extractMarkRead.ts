export function extractMarkRead(
  message: string
) {
  const fromMatch =
    message.match(
      /from\s+(.+?)\s+as\s+read/i
    );

  return {
    sender:
      fromMatch?.[1]?.trim(),
  };
}