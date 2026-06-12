export function detectIntent(message: string) {
  const lower = message.toLowerCase();

  const isEmailQuery =
    lower.includes("email") ||
    lower.includes("emails") ||
    lower.includes("mail") ||
    lower.includes("gmail") ||
    lower.includes("inbox") ||
    lower.includes("unread");

  const isCalendarQuery =
    lower.includes("meeting") ||
    lower.includes("meetings") ||
    lower.includes("calendar") ||
    lower.includes("event") ||
    lower.includes("events") ||
    lower.includes("schedule") ||
    lower.includes("appointment") ||
    lower.includes("interview");

  const isCreateEventQuery =
    lower.includes("create event") ||
    lower.includes("schedule") ||
    lower.includes("book meeting") ||
    lower.includes("set up meeting");

  const isSendEmailQuery =
    lower.includes("send email") ||
    lower.includes("send mail") ||
    lower.includes("email to") ||
    lower.includes("mail to");

  const isMultiActionQuery =
    isCreateEventQuery && isSendEmailQuery;

  return {
    isEmailQuery,
    isCalendarQuery,
    isCreateEventQuery,
    isSendEmailQuery,
    isMultiActionQuery,
  };
}