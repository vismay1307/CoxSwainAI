export function extractDeleteEvent(
  message: string
) {
  const title =
    message
      .replace(
        /delete event/i,
        ""
      )
      .replace(
        /cancel event/i,
        ""
      )
      .replace(
        /delete meeting/i,
        ""
      )
      .replace(
        /cancel meeting/i,
        ""
      )
      .trim();

  return {
    title,
  };
}