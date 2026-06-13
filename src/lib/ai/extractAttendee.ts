export function extractAttendee(
  message: string
) {
  const emailMatch =
    message.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

  let title = message;

  if (emailMatch) {
    title = title.replace(
      emailMatch[0],
      ""
    );
  }

  title = title
    .replace(/add/i, "")
    .replace(/invite/i, "")
    .replace(/\s+to\s+/i, "")
    .trim();

  return {
    email:
      emailMatch?.[0],
    title,
  };
}