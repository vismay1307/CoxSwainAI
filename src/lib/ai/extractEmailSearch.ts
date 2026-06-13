export function extractEmailSearch(
  message: string
) {
  const lower =
    message.toLowerCase();

if (
  lower.includes("unread")
) {
  return {
    query: "is:unread",
  };
}

if (
  lower.includes("starred")
) {
  return {
    query: "is:starred",
  };
}

if (
  lower.includes("important")
) {
  return {
    query: "is:important",
  };
}
if (
  lower.includes("today")
) {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const unixSeconds =
    Math.floor(
      today.getTime() /
        1000
    );

  return {
    query: `after:${unixSeconds}`,
  };
}
const fromMatch =
  message.match(
    /(?:emails?|mails?)\s+from\s+(.+)/i
  );

if (fromMatch) {
  return {
    query: `from:${fromMatch[1].trim()}`,
  };
}

  const containingMatch =
    message.match(
      /containing\s+(.+)/i
    );

  if (containingMatch) {
    return {
      query:
        containingMatch[1].trim(),
    };
  }

  return {
    query: message,
  };
}