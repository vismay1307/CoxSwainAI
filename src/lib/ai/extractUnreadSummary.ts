export function extractUnreadSummary(
  message: string
) {
  const countMatch =
    message.match(/\d+/);

  return {
    count: countMatch
      ? Number(countMatch[0])
      : 5,
  };
}