import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { createEvent } from "@/lib/calendar/createEvent";
import { sendEmail } from "@/lib/gmail/sendEmail";
import { extractEmail } from "@/lib/ai/extractEmail";
import { extractEvent } from "@/lib/ai/extractEvent";
import { extractMultiAction } from "@/lib/ai/extractMultiAction";

import { readEmails } from "@/lib/gmail/readEmails";
import { readEvents } from "@/lib/calendar/readEvents";
import { detectIntent } from "@/lib/ai/detectIntent";
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

const {
  isEmailQuery,
  isCalendarQuery,
  isCreateEventQuery,
  isSendEmailQuery,
  isMultiActionQuery,
} = detectIntent(message);

    if (isMultiActionQuery) {
      const data = await extractMultiAction(message);

      // EMAIL SEND

      await sendEmail(data.email.to, data.email.subject, data.email.body);

      // CALENDAR CREATE

      await createEvent(
        data.calendar.title,
        data.calendar.start,
        data.calendar.end,
      );

      return Response.json({
        source: "multi-action",
        response: "✅ Email sent and calendar event created successfully",
      });
    }

    if (isCreateEventQuery) {
      const eventData = await extractEvent(message);
      const event = await createEvent(
        eventData.title,
        eventData.start,
        eventData.end,
      );

      return Response.json({
        source: "calendar-create",
        response: `✅ ${eventData.title} scheduled successfully`,
        event,
      });
    }
    if (isSendEmailQuery) {
      const emailData = await extractEmail(message);

      if (!emailData.subject?.trim()) {
        emailData.subject = "Message from Coxswain AI";
      }

      const result = await sendEmail(
        emailData.to,
        emailData.subject,
        emailData.body,
      );

      return Response.json({
        source: "gmail-send",
        response: `✅ Email sent to ${emailData.to}`,
        result,
      });
    }

    // =========================
    // GMAIL FLOW
    // =========================
    if (isEmailQuery) {
      const emailDetails = await readEmails(5);

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `
  You are an AI email assistant.
  
  User asked:
  ${message}
  
  Recent Emails:
  ${JSON.stringify(emailDetails, null, 2)}
  
  Answer the user's question based only on these emails.
  `,
      });

      return Response.json({
        source: "gmail",
        response: result.text,
        emails: emailDetails,
      });
    }

    // =========================
    // CALENDAR FLOW
    // =========================
    if (isCalendarQuery) {
      const events = await readEvents(20);

      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `
  You are an AI calendar assistant.
  
  User asked:
  ${message}
  
  Calendar Events:
  ${JSON.stringify(events, null, 2)}
  
  Answer the user's question based only on the calendar data.
  `,
      });

      return Response.json({
        source: "calendar",
        response: result.text,
        events: events,
      });
    }

    // =========================
    // FALLBACK
    // =========================
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `
  You are CoxswainAI.
  
  The user asked:
  ${message}
  
  Respond normally.
  `,
    });

    return Response.json({
      source: "general",
      response: result.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        source: "error",
        response: "❌ Something went wrong while processing your request.",
      },
      {
        status: 500,
      },
    );
  }
}
