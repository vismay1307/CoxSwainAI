export function isEmailSearchQuery(
  message: string
) {
  const lower =
    message.toLowerCase();



  return (
    lower.includes("search email") ||
    lower.includes("search emails") ||
    lower.includes("show unread emails") ||
    lower.includes("show starred emails") ||
    lower.includes("emails from") ||
lower.includes("email from") ||
lower.includes("mails from") ||
lower.includes("mail from")||
    lower.includes("show important emails") ||
    lower.includes("show today's emails") ||
    lower.includes("show today emails")||
    lower.includes("containing")
  );
}