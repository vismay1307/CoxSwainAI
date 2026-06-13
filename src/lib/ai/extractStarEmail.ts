export function extractStarEmail(
  message: string
) {
  const fromMatch =
    message.match(
      /from\s+(.+)/i
    );

  return {
    sender:
      fromMatch?.[1]?.trim(),
  };
}