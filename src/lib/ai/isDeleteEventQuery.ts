export function isDeleteEventQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes(
      "delete event"
    ) ||
    lower.includes(
      "cancel event"
    ) ||
    lower.includes(
      "delete meeting"
    ) ||
    lower.includes(
      "cancel meeting"
    )
  );
}