export function isMarkReadQuery(
  message: string
) {
  const lower =
    message.toLowerCase();

  return (
    lower.includes("mark") &&
    lower.includes("read")
  );
}