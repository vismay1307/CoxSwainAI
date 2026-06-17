import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { parseJsonResponse } from "@/lib/utils/parseJson";

export type StructuredAction =
  | {
      action: "create_event";
      title: string;
      start: string;
      end: string;
    }
  | {
      action: "update_event";
      title: string;
      start: string;
      end: string;
      eventId?: string;
    }
  | {
      action: "delete_event";
      title: string;
      eventId?: string;
    }
  | {
      action: "send_email";
      to: string;
      subject: string;
      body: string;
    }
  | {
      action: "reply_email";
      sender?: string;
      latest?: boolean;
      body: string;
    }
  | {
      action: "search_email";
      query: string;
      maxResults?: number;
    }
  | {
      action: "mark_read";
      sender?: string;
      latest?: boolean;
    }
  | {
      action: "star_email";
      sender?: string;
      latest?: boolean;
    };

type StructuredActionsResponse = {
  actions: StructuredAction[];
};

export async function extractStructuredActions(
  message: string
) {
  const currentDate = new Date().toISOString();

  const extraction = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
You are converting a user request into structured actions.

Current date:
${currentDate}

Return ONLY valid JSON.

Example:

{
"actions": [
{
"action": "create_event",
"title": "Demo",
"start": "2026-06-18T17:00:00+05:30",
"end": "2026-06-18T18:00:00+05:30"
}
]
}

Supported action values:

* create_event
* update_event
* delete_event
* send_email
* reply_email
* search_email
* mark_read
* star_email

Rules:

Rules:

* Use real data only.
* Return multiple actions if the user requests multiple operations.
* Generate actions in the same order as requested by the user.
* Never invent users, email addresses, events, dates, or identifiers.
* Never return placeholder values.
* Never return example values literally.
* Never return:

  * "Subject"
  * "Email content"
  * "Demo"
  * "Test"
  * "Example"
* Infer meaningful values from the user's request.

For search_email:

* Prefer Gmail search syntax.
* Examples:

  * unread emails → is:unread
  * emails from Amazon → from:amazon.com
  * recent emails → newer_than:7d

For create_event:

* title is REQUIRED.
* start is REQUIRED.
* end is REQUIRED.
* Always return ISO 8601 datetime strings.
* If no duration is specified, use 60 minutes.
* Infer the title from the user's request whenever possible.

Examples:

"create project review tomorrow 7 pm"

→

{
"action": "create_event",
"title": "Project Review"
}

"schedule interview friday"

→

{
"action": "create_event",
"title": "Interview"
}

Only use:

"Meeting"

when no meaningful title can be inferred.

For update_event:

* Include the most specific title available.
* Preserve the original event intent.
* Return updated start/end times.

For delete_event:

* Include the most specific title available.
* Never use generic titles if a specific title exists.

For send_email:

Use EXACTLY this schema:

{
"action": "send_email",
"to": "[recipient@example.com](mailto:recipient@example.com)",
"subject": "Generated Subject",
"body": "Generated email body"
}

IMPORTANT:

Always use:

* to

Never use:

* recipient
* recipients
* email
* emails

If multiple recipients exist:

{
"action": "send_email",
"to": "[user1@example.com](mailto:user1@example.com),[user2@example.com](mailto:user2@example.com)",
"subject": "Generated Subject",
"body": "Generated email body"
}

Generate meaningful subjects.

Bad:

* Subject
* Test
* Email

Good:

* Meeting Invitation - Tomorrow 7 PM
* Project Review Meeting
* Interview Schedule
* Follow-up Regarding Project Review

Generate meaningful email bodies.

Bad:

* Email content
* Test email
* Placeholder text

Good:

"Hi,

You are invited to the Project Review meeting scheduled for tomorrow at 7 PM.

Please let me know if you have any scheduling conflicts.

Regards"

For reply_email:

If the user refers to:

* latest email
* most recent email

Return:

{
"action": "reply_email",
"latest": true,
"body": "generated reply text"
}

Do not require sender when user refers to the latest email.

For mark_read:

If the user refers to:

* latest email
* most recent email

Return:

{
"action": "mark_read",
"latest": true
}

For star_email:

If the user refers to:

* latest email
* most recent email

Return:

{
"action": "star_email",
"latest": true
}

IMPORTANT:

Do NOT generate search_email for:

* latest emails
* recent emails
* show inbox
* inbox
* show my emails
* show my latest emails

For these requests return:

{
"actions": []
}

When the user requests both calendar and email operations:

Example:

"create project review tomorrow 7 pm and email attendees"

Return BOTH actions:

[
{
"action": "create_event",
"title": "Project Review"
},
{
"action": "send_email",
"to": "...",
"subject": "Project Review Meeting",
"body": "..."
}
]

Never merge multiple user intents into a single action.

If a request is unsupported:

{
"actions": []
}

${message}
`,
  });

  const parsed = parseJsonResponse(
    extraction.text
  ) as StructuredActionsResponse;

  return {
    actions: Array.isArray(parsed.actions)
      ? parsed.actions
      : [],
  };
}