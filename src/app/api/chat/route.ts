import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { createEvent } from "@/lib/calendar/createEvent";
import { sendEmail } from "@/lib/gmail/sendEmail";
import { extractEmail } from "@/lib/ai/extractEmail";
import { extractEvent } from "@/lib/ai/extractEvent";
import { extractMultiAction } from "@/lib/ai/extractMultiAction";
import { extractStructuredActions } from "@/lib/ai/extractStructuredActions";
import { createIssue } from "@/lib/github/createIssue";
import { corsair } from "@/server/corsair";
import { listRepos } from "@/lib/github/listRepos";
import { isGithubRepoQuery } from "@/lib/ai/isGithubRepoQuery";
import { extractGithubIssue } from "@/lib/ai/extractGithubIssue";
import { findRepo } from "@/lib/github/findRepo";
import { isGithubIssueQuery } from "@/lib/ai/isGithubIssueQuery";
import { readEmails } from "@/lib/gmail/readEmails";
import { readEvents } from "@/lib/calendar/readEvents";
import { detectIntent } from "@/lib/ai/detectIntent";
import { listIssues } from "@/lib/github/listIssues";
import { isGithubListIssuesQuery } from "@/lib/ai/isGithubListIssuesQuery";
import { createComment } from "@/lib/github/createComment";
import { extractGithubComment } from "@/lib/ai/extractGithubComment";
import { isGithubCommentQuery } from "@/lib/ai/isGithubCommentQuery";
import { starRepo } from "@/lib/github/starRepo";
import { isGithubStarQuery } from "@/lib/ai/isGithubStarQuery";
import { extractGithubRepo } from "@/lib/ai/extractGithubRepo";
import { listPullRequests } from "@/lib/github/listPullRequests";
import { isGithubPullRequestQuery } from "@/lib/ai/isGithubPullRequestQuery";
import { listBranches } from "@/lib/github/listBranches";
import { isGithubBranchesQuery } from "@/lib/ai/isGithubBranchesQuery";
import { listCommits } from "@/lib/github/listCommits";
import { isGithubCommitsQuery } from "@/lib/ai/isGithubCommitsQuery";
import { getFileContent } from "@/lib/github/getFileContent";
import { isGithubFileQuery } from "@/lib/ai/isGithubFileQuery";
import { extractGithubFile } from "@/lib/ai/extractGithubFile";
import { searchEmails } from "@/lib/gmail/searchEmails";
import { isEmailSearchQuery } from "@/lib/ai/isEmailSearchQuery";
import { extractEmailSearch } from "@/lib/ai/extractEmailSearch";
import { isMarkReadQuery } from "@/lib/ai/isMarkReadQuery";
import { extractMarkRead } from "@/lib/ai/extractMarkRead";
import { markEmailRead } from "@/lib/gmail/markEmailRead";
import { isStarEmailQuery } from "@/lib/ai/isStarEmailQuery";
import { extractStarEmail } from "@/lib/ai/extractStarEmail";
import { starEmail } from "@/lib/gmail/starEmail";
import { isDraftEmailQuery } from "@/lib/ai/isDraftEmailQuery";
import { generateDraftEmail } from "@/lib/ai/generateDraftEmail";
import { isUnreadSummaryQuery } from "@/lib/ai/isUnreadSummaryQuery";
import { summarizeUnreadEmails } from "@/lib/gmail/summarizeUnreadEmails";
import { extractUnreadSummary } from "@/lib/ai/extractUnreadSummary";
import { isReplyEmailQuery } from "@/lib/ai/isReplyEmailQuery";
import { extractReplyEmail } from "@/lib/ai/extractReplyEmail";
import { replyToEmail } from "@/lib/gmail/replyToEmail";
import { isUpcomingEventsQuery } from "@/lib/ai/isUpcomingEventsQuery";
import { getUpcomingEvents } from "@/lib/calendar/getUpcomingEvents";
import { extractEventDateRange } from "@/lib/ai/extractEventDateRange";
import { isEventDateRangeQuery } from "@/lib/ai/isEventDateRangeQuery";
import { isDeleteEventQuery } from "@/lib/ai/isDeleteEventQuery";
import { extractDeleteEvent } from "@/lib/ai/extractDeleteEvent";
import { deleteEvent } from "@/lib/calendar/deleteEvent";
import { searchEvents } from "@/lib/calendar/searchEvents";
import { isUpdateEventQuery } from "@/lib/ai/isUpdateEventQuery";
import { extractUpdateEvent } from "@/lib/ai/extractUpdateEvent";
import { updateEvent } from "@/lib/calendar/updateEvent";
import { isAddAttendeeQuery } from "@/lib/ai/isAddAttendeeQuery";
import { extractAttendee } from "@/lib/ai/extractAttendee";
import { addAttendee } from "@/lib/calendar/addAttendee";
import { isScheduleSummaryQuery } from "@/lib/ai/isScheduleSummaryQuery";
import { isMeetingCountQuery } from "@/lib/ai/isMeetingCountQuery";
import { getWeekEvents } from "@/lib/calendar/getWeekEvents";
import { isBusiestDayQuery } from "@/lib/ai/isBusiestDayQuery";
import { checkConflict } from "@/lib/calendar/checkConflict";
import { auth } from "@clerk/nextjs/server";
import { isInboxSummaryQuery } from "@/lib/ai/isInboxSummaryQuery";
import { isUrgentEmailQuery } from "@/lib/ai/isUrgentEmailQuery";
import { isReplyNeededQuery } from "@/lib/ai/isReplyNeededQuery";
import { isCatchMeUpQuery } from "@/lib/ai/isCatchMeUpQuery";
import { generateInboxIntelligence } from "@/lib/ai/generateInboxIntelligence";

async function findEventByTitle(
  userId: string,
  title: string
) {
  const events = await getUpcomingEvents(
    userId,
    50
  );

  const normalizedTitle =
    title.toLowerCase().trim();

  return events.find(
  (event) => {
    const summary =
      (
        event.summary ??
        ""
      ).toLowerCase();

    return (
      summary.includes(
        normalizedTitle
      ) ||
      normalizedTitle.includes(
        summary
      )
    );
  }
  );
}

async function getLatestInboxEmail(
  userId: string
) {
  const emails =
    await searchEmails(
      userId,
      "in:inbox",
      1
    );

  return emails.messages?.[0] ?? null;
}

async function executeStructuredActions(
  userId: string,
  message: string
) {
  const { actions } =
    await extractStructuredActions(
      message
    );
  console.log(
    "STRUCTURED ACTIONS:",
    JSON.stringify(actions, null, 2)
  );

  if (!actions.length) {
    return null;
  }

  const tenant =
    corsair.withTenant(userId);
  const results: Array<{
    action: string;
    response: string;
    data?: unknown;
  }> = [];

  for (
    const action of actions
  ) {
    console.log("STRUCTURED ACTION", action);

    if (
      action.action ===
      "create_event"
    ) {
      if (!action.start || !action.end) {
        results.push({
          action:
            "create_event",
          response:
            "I could not determine a valid start or end time for that meeting.",
        });
        continue;
      }

      const event =
        await createEvent(
          userId,
          action.title,
          action.start,
          action.end
        );

      results.push({
        action:
          "create_event",
        response: `Created event: ${action.title}`,
        data: event,
      });
      continue;
    }

    if (
      action.action ===
      "update_event"
    ) {
      if (!action.start || !action.end) {
        results.push({
          action:
            "update_event",
          response:
            "I could not determine a valid start or end time for that event.",
        });
        continue;
      }

      const event =
        action.eventId
          ? {
              id: action.eventId,
            }
          : await findEventByTitle(
              userId,
              action.title
            );

      if (!event?.id) {
        results.push({
          action:
            "update_event",
          response:
            "Event not found",
        });
        continue;
      }

      const updated =
        await updateEvent(
          userId,
          event.id,
          action.title,
          action.start,
          action.end
        );

      results.push({
        action:
          "update_event",
        response: `Updated event: ${action.title}`,
        data: updated,
      });
      continue;
    }

    if (
      action.action ===
      "delete_event"
    ) {
      if (!action.title && !action.eventId) {
        results.push({
          action:
            "delete_event",
          response:
            "I could not identify which event to delete.",
        });
        continue;
      }

      const event =
        action.eventId
          ? {
              id: action.eventId,
              summary: action.title,
            }
          : await findEventByTitle(
              userId,
              action.title
            );

      if (!event?.id) {
        results.push({
          action:
            "delete_event",
          response:
            "Event not found",
        });
        continue;
      }

      const deleted =
        await deleteEvent(
          userId,
          event.id
        );

      results.push({
        action:
          "delete_event",
        response: `Deleted event: ${event.summary ?? action.title}`,
        data: deleted,
      });
      continue;
    }

    if (
      action.action ===
      "send_email"
    ) {
      if (!action.to || !action.subject || !action.body) {
        results.push({
          action:
            "send_email",
          response:
            "I could not extract a complete email payload.",
        });
        continue;
      }

      const sent =
        await sendEmail(
          userId,
          action.to,
          action.subject,
          action.body
        );

      results.push({
        action:
          "send_email",
        response: `Email sent to ${action.to}`,
        data: sent,
      });
      continue;
    }

    if (
      action.action ===
      "reply_email"
    ) {
      const isLatest = Boolean(
        (action as any).latest
      );

      if (!action.body) {
        results.push({
          action:
            "reply_email",
          response:
            "I could not extract a reply body.",
        });
        continue;
      }

      const latestEmail =
        isLatest
          ? await getLatestInboxEmail(
              userId
            )
          : null;

      const targetEmail =
        isLatest
          ? latestEmail
          : action.sender
            ? (
                await searchEmails(
                  userId,
                  `from:${action.sender}`,
                  1
                )
              ).messages?.[0] ?? null
            : null;

      if (!targetEmail?.id) {
        results.push({
          action:
            "reply_email",
          response:
            isLatest
              ? "No email found"
              : "No matching email found",
        });
        continue;
      }

      const email =
        await tenant.gmail.api.messages.get(
          {
            id: targetEmail.id,
            format: "full",
          }
        );

      const headers =
        email.payload?.headers ?? [];
      const subject =
        headers.find(
          (h) =>
            h.name?.toLowerCase() ===
            "subject"
        )?.value ?? "";
      const from =
        headers.find(
          (h) =>
            h.name?.toLowerCase() ===
            "from"
        )?.value ?? "";
      const emailMatch =
        from.match(/<(.+?)>/);
      const recipient =
        emailMatch?.[1];

      if (!recipient) {
        results.push({
          action:
            "reply_email",
          response:
            "Could not determine recipient",
        });
        continue;
      }

      const replied =
        await replyToEmail(
          userId,
          recipient,
          subject,
          action.body,
          email.threadId!
        );

      results.push({
        action:
          "reply_email",
        response: isLatest
          ? "Replied to latest email"
          : `Replied to ${action.sender}`,
        data: replied,
      });
      continue;
    }

    if (
  action.action ===
  "search_email"
) {
  if (!action.query?.trim()) {
    continue;
  }

      const emails =
        await searchEmails(
          userId,
          action.query,
          action.maxResults ?? 10
        );

      const detailedEmails =
        await Promise.all(
          (emails.messages ?? []).map(
            (email) =>
              tenant.gmail.api.messages.get(
                {
                  id: email.id!,
                }
              )
          )
        );

    const latestEmailLines =
  detailedEmails
    .slice(0, 5)
    .map((email: any, index) => {
      const headers =
        email.payload?.headers ?? [];

      const subject =
        headers.find(
          (h: any) =>
            h.name?.toLowerCase() ===
            "subject"
        )?.value ?? "No Subject";

      const from =
        headers.find(
          (h: any) =>
            h.name?.toLowerCase() ===
            "from"
        )?.value ?? "Unknown Sender";

      return `${index + 1}. ${subject}\nFrom: ${from}`;
    })
    .join("\n\n");

results.push({
  action: "search_email",
  response: `Latest Emails\n\n${latestEmailLines}`,
  data: detailedEmails,
});
      continue;
    }

    if (
      action.action ===
      "mark_read"
    ) {
      const isLatest = Boolean(
        (action as any).latest
      );

      if (isLatest) {
        const latestEmail =
          await getLatestInboxEmail(
            userId
          );

        if (!latestEmail?.id) {
          results.push({
            action: "mark_read",
            response: "No email found",
          });
          continue;
        }

        const marked =
          await markEmailRead(
            userId,
            latestEmail.id
          );

        results.push({
          action: "mark_read",
          response:
            "Marked latest email as read",
          data: marked,
        });

        continue;
      }

      if (!action.sender) {
        results.push({
          action:
            "mark_read",
          response:
            "I could not identify which sender to mark as read.",
        });
        continue;
      }

      const emails =
        await searchEmails(
          userId,
          `from:${action.sender}`,
          1
        );
      const latestEmail =
        emails.messages?.[0];

      if (!latestEmail?.id) {
        results.push({
          action:
            "mark_read",
          response:
            "No matching email found",
        });
        continue;
      }

      const marked =
        await markEmailRead(
          userId,
          latestEmail.id
        );

      results.push({
        action:
          "mark_read",
        response: `Marked latest email from ${action.sender} as read`,
        data: marked,
      });
      continue;
    }

if (
  action.action ===
  "star_email"
) {
  const isLatest = Boolean(
    (action as any).latest
  );

  if (isLatest) {
    const latestEmail =
      await getLatestInboxEmail(
        userId
      );

    if (!latestEmail?.id) {
      results.push({
        action: "star_email",
        response: "No email found",
      });
      continue;
    }

    const starred =
      await starEmail(
        userId,
        latestEmail.id
      );

    results.push({
      action: "star_email",
      response:
        "Starred latest email",
      data: starred,
    });

    continue;
  }

  if (!action.sender) {
    results.push({
      action:
        "star_email",
      response:
        "I could not identify which sender to star.",
    });
    continue;
  }

  const emails =
    await searchEmails(
      userId,
      `from:${action.sender}`,
      1
    );

  const latestEmail =
    emails.messages?.[0];

  if (!latestEmail?.id) {
    results.push({
      action:
        "star_email",
      response:
        "No matching email found",
    });
    continue;
  }

  const starred =
    await starEmail(
      userId,
      latestEmail.id
    );

  results.push({
    action:
      "star_email",
    response: `Starred latest email from ${action.sender}`,
    data: starred,
  });

  continue;
}
  }

  if (results.length === 0) {
    return null;
  }

  return results;
}

async function collectInboxData(userId: string) {
  const tenant = corsair.withTenant(userId);
  const searchResult = await searchEmails(
    userId,
    "newer_than:14d",
    20
  );

  const detailedEmails = await Promise.all(
    (searchResult.messages ?? []).map((email) =>
      tenant.gmail.api.messages.get({
        id: email.id!,
        format: "full",
      })
    )
  );

  const upcomingEvents = await getUpcomingEvents(
    userId,
    10
  );

  return {
    emails: detailedEmails.map((email) => ({
      id: email.id,
      threadId: email.threadId,
      labelIds: email.labelIds,
      internalDate: email.internalDate,
      subject:
        email.payload?.headers?.find(
          (header) =>
            header.name?.toLowerCase() === "subject"
        )?.value ?? "No Subject",
      from:
        email.payload?.headers?.find(
          (header) =>
            header.name?.toLowerCase() === "from"
        )?.value ?? "Unknown Sender",
      snippet: email.snippet ?? "",
    })),
    events: upcomingEvents,
  };
}

export async function POST(req: Request) {
  try {
const { userId } = await auth();

if (!userId) {
  return Response.json(
    {
      response: "Please sign in first",
    },
    {
      status: 401,
    }
  );
    }
    const { message } = await req.json();

    const structuredActions =
      await executeStructuredActions(
        userId,
        message
      );

    if (structuredActions) {
      const response =
        structuredActions
          .map((item) => item.response)
          .join("\n");

      return Response.json({
        source:
          structuredActions.length > 1
            ? "structured-multi-action"
            : "structured-action",
        response,
        actions: structuredActions,
      });
    }

    if (
      isCatchMeUpQuery(message) ||
      isInboxSummaryQuery(message) ||
      isUrgentEmailQuery(message) ||
      isReplyNeededQuery(message) ||
      isScheduleSummaryQuery(message)
    ) {
      const { emails, events } =
        await collectInboxData(userId);

      const response =
        await generateInboxIntelligence(
          message,
          emails,
          events
        );

      let source = "gmail-intelligence";

      if (isCatchMeUpQuery(message)) {
        source = "catch-me-up";
      } else if (isUrgentEmailQuery(message)) {
        source = "gmail-urgent";
      } else if (isReplyNeededQuery(message)) {
        source = "gmail-reply-needed";
      } else if (isInboxSummaryQuery(message)) {
        source = "gmail-inbox-summary";
      } else if (isScheduleSummaryQuery(message)) {
        source = "calendar-summary";
      }

      return Response.json({
        source,
        response,
        emails,
        events,
      });
    }

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

 await sendEmail(
  userId,
  data.email.to,
  data.email.subject,
  data.email.body
);

await createEvent(
  userId,
  data.calendar.title,
  data.calendar.start,
  data.calendar.end
);

      return Response.json({
        source: "multi-action",
        response: "✅ Email sent and calendar event created successfully",
      });
    }

    if (isGithubIssueQuery(message)) {
      console.time("extract");
  const issueData =
    await extractGithubIssue(message);
    console.timeEnd("extract");
    console.time("findRepo");
if (!issueData.repo) {
  return Response.json({
    source: "github-issue",
    response: "❌ Repository name not found",
  });
}

const repo = await findRepo(
  userId,
  issueData.repo
);
console.timeEnd("findRepo");

if (!repo) {
  return Response.json({
    source: "github-issue",
    response: `❌ Repository ${issueData.repo} not found`,
  });
}

// repo.owner may be undefined or an object with a login property
const owner = repo.owner?.login ?? (typeof repo.owner === "string" ? repo.owner : undefined);
if (!owner) {
  return Response.json({
    source: "github-issue",
    response: `❌ Could not determine repository owner for ${issueData.repo}`,
  });
}

const issue = await createIssue(
  userId,
  owner,
  issueData.repo!,
  issueData.title ?? "New Issue",
  issueData.body ?? "",
);
console.timeEnd("createIssue");

  return Response.json({
    source: "github-issue",

    response: `✅ Issue created successfully: ${issue.title}`,

    issue,
  });
}
if (isGithubCommentQuery(message)) {
  const commentData =
    await extractGithubComment(message);

  if (!commentData.repo) {
    return Response.json({
      source: "github-comment",
      response: "❌ Repository name not found",
    });
  }

  const repo = await findRepo(
    userId,
    commentData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-comment",
      response: `❌ Repository ${commentData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-comment",
      response:
        "❌ Could not determine repository owner",
    });
  }

  const comment =
    await createComment(
      userId,
      owner,
      commentData.repo,
      commentData.issueNumber,
      commentData.body
    );

  return Response.json({
    source: "github-comment",
    response: "✅ Comment added successfully",
    comment,
  });
}
if (isGithubStarQuery(message)) {
  const repoData =
    await extractGithubRepo(message);

  if (!repoData.repo) {
    return Response.json({
      source: "github-star",
      response: "❌ Repository name not found",
    });
  }

  const repo = await findRepo(
    userId,
    repoData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-star",
      response: `❌ Repository ${repoData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-star",
      response:
        "❌ Could not determine repository owner",
    });
  }

  await starRepo(
    userId,
    owner,
    repoData.repo
  );

  return Response.json({
    source: "github-star",
    response: `⭐ Repository ${repoData.repo} starred successfully`,
  });
}
if (isGithubRepoQuery(message)) {
  const repos = await listRepos(userId);

  const repoNames = repos.map((repo: any) => ({
    name: repo.name,
    owner: repo.owner?.login,
    url: repo.html_url,
  }));

const formattedRepos = repoNames
  .slice(0, 10)
  .map(
    (repo) =>
      `• ${repo.name}${
        repo.owner
          ? ` (${repo.owner})`
          : ""
      }`
  )
  .join("\n");

return Response.json({
  source: "github-repos",
  response: `Repositories:\n\n${formattedRepos}`,
});
}
if (isGithubListIssuesQuery(message)) {
  const issueData =
    await extractGithubIssue(message);

  if (!issueData.repo) {
    return Response.json({
      source: "github-issues",
      response: "❌ Repository name not found",
    });
  }

  const repo = await findRepo(
    userId,
    issueData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-issues",
      response: `❌ Repository ${issueData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-issues",
      response:
        "❌ Could not determine repository owner",
    });
  }

  const issues = await listIssues(
    userId,
    owner,
    issueData.repo
  );

const formattedIssues = issues
  .slice(0, 10)
  .map(
    (issue: any) =>
      `#${issue.number} - ${issue.title}`
  )
  .join("\n");

return Response.json({
  source: "github-issues",
  response: `Open Issues:\n\n${formattedIssues}`,
});
}
if (isGithubPullRequestQuery(message)) {
  const repoData =
    await extractGithubRepo(message);

  if (!repoData.repo) {
    return Response.json({
      source: "github-prs",
      response:
        "❌ Repository name not found",
    });
  }

  const repo = await findRepo(userId,
    repoData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-prs",
      response: `❌ Repository ${repoData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-prs",
      response:
        "❌ Could not determine repository owner",
    });
  }

  const prs =
    await listPullRequests(
      userId,
      owner,
      repoData.repo
    );

const formattedPRs = prs
  .slice(0, 10)
  .map(
    (pr: any) =>
      `#${pr.number} - ${pr.title}`
  )
  .join("\n");

return Response.json({
  source: "github-prs",
  response: `Pull Requests:\n\n${formattedPRs}`,
});
}  
if (isGithubBranchesQuery(message)) {
  const repoData =
    await extractGithubRepo(message);

  if (!repoData.repo) {
    return Response.json({
      source: "github-branches",
      response:
        "❌ Repository name not found",
    });
  }

  const repo = await findRepo(userId,
    repoData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-branches",
      response: `❌ Repository ${repoData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-branches",
      response:
        "❌ Could not determine repository owner",
    });
  }

  const branches =
    await listBranches(userId,
      owner,
      repoData.repo
    );

 const formattedBranches =
  branches
    .slice(0, 20)
    .map(
      (branch: any) =>
        `• ${branch.name}`
    )
    .join("\n");

return Response.json({
  source: "github-branches",
  response: `Branches:\n\n${formattedBranches}`,
});
}  
if (isGithubCommitsQuery(message)) {
  const repoData =
    await extractGithubRepo(message);

  if (!repoData.repo) {
    return Response.json({
      source: "github-commits",
      response:
        "❌ Repository name not found",
    });
  }

  const repo = await findRepo(userId,
    repoData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-commits",
      response: `❌ Repository ${repoData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-commits",
      response:
        "❌ Could not determine repository owner",
    });
  }

  const commits =
    await listCommits(
      userId,
      owner,
      repoData.repo
    );

 const formattedCommits =
  commits
    .slice(0, 10)
    .map(
      (commit: any) =>
        `• ${
          commit.commit?.message ??
          "No message"
        }\n  by ${
          commit.commit?.author
            ?.name ?? "Unknown"
        }`
    )
    .join("\n\n");

return Response.json({
  source: "github-commits",
  response:
    `Latest Commits:\n\n${formattedCommits}`,
});
} 
if (isGithubFileQuery(message)) {
  const fileData =
    extractGithubFile(message);

  if (!fileData.repo) {
    return Response.json({
      source: "github-file",
      response:
        "❌ Repository name not found",
    });
  }

  const repo = await findRepo(userId,
    fileData.repo
  );

  if (!repo) {
    return Response.json({
      source: "github-file",
      response: `❌ Repository ${fileData.repo} not found`,
    });
  }

  const owner =
    repo.owner?.login ??
    (typeof repo.owner === "string"
      ? repo.owner
      : undefined);

  if (!owner) {
    return Response.json({
      source: "github-file",
      response:
        "❌ Could not determine repository owner",
    });
  }

const content =
  await getFileContent(userId,
    owner,
    fileData.repo,
    fileData.path
  );

return Response.json({
  source: "github-file",
  response: content,
});
}          
if (isCreateEventQuery) {
  const eventData =
    await extractEvent(
      message
    );
console.log(
  "EVENT DATA:",
  eventData
);
  const conflict =
    await checkConflict(
      userId,
      eventData.start,
      eventData.end
    );

  if (conflict) {
    return Response.json({
      source:
        "calendar-conflict",

      response: `❌ Conflict detected with "${conflict.data?.summary}"`,
    });
  }

  const event =
    await createEvent(
      userId,
      eventData.title,
      eventData.start,
      eventData.end
    );
console.log(
  "CREATE EVENT RESPONSE",
  JSON.stringify(event, null, 2)
);
  return Response.json({
    source:
      "calendar-create",

    response: `✅ ${eventData.title} scheduled successfully`,

    event,
  });
}
    if (isDraftEmailQuery(message)) {
  const draft =
    await generateDraftEmail(
      message
    );

  return Response.json({
    source: "gmail-draft",
    response: draft,
  });
}
if (
  isReplyEmailQuery(
    message
  )
) {
  const data =
    extractReplyEmail(
      message
    );

  const emails =
    await searchEmails(
      userId,
      `from:${data.sender}`,
      1
    );

  const latestEmail =
    emails.messages?.[0];

  if (!latestEmail?.id) {
    return Response.json({
      source: "gmail-reply",
      response:
        "❌ No matching email found",
    });
  }

  const tenant =
    corsair.withTenant(userId);

  const email =
    await tenant.gmail.api.messages.get({
      id: latestEmail.id,
      format: "full",
    });

  const headers =
    email.payload?.headers ?? [];

  const from =
    headers.find(
      (h) =>
        h.name?.toLowerCase() ===
        "from"
    )?.value;

  const subject =
    headers.find(
      (h) =>
        h.name?.toLowerCase() ===
        "subject"
    )?.value ?? "";

  const emailMatch =
    from?.match(
      /<(.+?)>/
    );

  const recipient =
    emailMatch?.[1];

  if (!recipient) {
    return Response.json({
      source: "gmail-reply",
      response:
        "❌ Could not determine recipient",
    });
  }

  await replyToEmail(
    userId,
    recipient,
    subject,
    data.reply!,
    email.threadId!
  );

  return Response.json({
    source: "gmail-reply",
    response: `✅ Replied to latest email from ${data.sender}`,
  });
}
    if (isSendEmailQuery) {
      const emailData = await extractEmail(message);

      if (!emailData.subject?.trim()) {
        emailData.subject = "Message from Coxswain AI";
      }

      const result = await sendEmail(
        userId,
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
if (isMarkReadQuery(message)) {
  const data =
    extractMarkRead(message);

  const emails =
    await searchEmails(
      userId,
      `from:${data.sender}`
    );

  const latestEmail =
    emails.messages?.[0];

  if (!latestEmail?.id) {
    return Response.json({
      source: "gmail-read",
      response:
        "❌ No matching email found",
    });
  }

  await markEmailRead(
    userId,
    latestEmail.id
  );

  return Response.json({
    source: "gmail-read",
    response: `✅ Marked latest email from ${data.sender} as read`,
  });
}

if (isStarEmailQuery(message)) {
  const data =
    extractStarEmail(message);

  const emails =
    await searchEmails(
      userId,
      `from:${data.sender}`
    );

  const latestEmail =
    emails.messages?.[0];

  if (!latestEmail?.id) {
    return Response.json({
      source: "gmail-star",  
      response:
        "❌ No matching email found",
    });
  }

  await starEmail(
    userId,
    latestEmail.id
  );

  return Response.json({
    source: "gmail-star",
    response: `⭐ Starred latest email from ${data.sender}`,
  });
}
if (
  isUnreadSummaryQuery(
    message
  )
) {
  const data =
    extractUnreadSummary(
      message
    );

  const summary =
    await summarizeUnreadEmails(

      data.count,
      userId
    );

  return Response.json({
    source:
      "gmail-summary",
    response: summary,
  });
}
if (isEmailSearchQuery(message)) {
    console.log("INSIDE BLOCK");
  const searchData =
    await extractEmailSearch(message);
  console.log(
    "QUERY:",
    searchData.query
  );
  const emails =
    await searchEmails(
      userId,
      searchData.query
    );

  const tenant =
    corsair.withTenant(userId);
  const detailedEmails =
    await Promise.all(
      (emails.messages ?? []).map(
        (email) =>
          tenant.gmail.api.messages.get({
            id: email.id!,
          })
      )
    );

  const normalizedEmails =
    detailedEmails.map((email: any) => {
      const headers =
        email.payload?.headers ?? [];
      const subject =
        headers.find(
          (header: any) =>
            header.name?.toLowerCase() ===
            "subject"
        )?.value ?? email.subject ?? "No Subject";
      const from =
        headers.find(
          (header: any) =>
            header.name?.toLowerCase() ===
            "from"
        )?.value ?? email.from ?? "Unknown Sender";
      const internalDate =
        email.internalDate ?? null;
      const labelIds =
        email.labelIds ?? [];

      return {
        id: String(email.id ?? ""),
        threadId:
          String(email.threadId ?? email.id ?? ""),
        subject,
        from,
        snippet: email.snippet ?? "",
        labelIds,
        internalDate,
        unread: Array.isArray(labelIds)
          ? labelIds.includes("UNREAD")
          : false,
        starred: Array.isArray(labelIds)
          ? labelIds.includes("STARRED")
          : false,
      };
    });

  const latestEmailLines =
    normalizedEmails
      .slice(0, 5)
      .map((email, index) => {
        const received =
          email.internalDate
            ? new Date(
                Number(email.internalDate)
              ).toLocaleString()
            : "Unknown";

        return `${index + 1}. Subject: ${email.subject}\nFrom: ${email.from}\nSnippet: ${email.snippet}\nReceived: ${received}`;
      })
      .join("\n\n");

  return Response.json({
    source: "gmail-search",
    response:
      normalizedEmails.length > 0
        ? `Latest Emails\n\n${latestEmailLines}`
        : "No emails found",
    emails: normalizedEmails,
  });
}
if (
  isAddAttendeeQuery(
    message
  )
) {
  const data =
    extractAttendee(
      message
    );

  const events =
    await getUpcomingEvents(
      userId,
      50
    );

  const event =
  events.find(
    (e) => {
      const summary =
        (
          e.summary ??
          ""
        ).toLowerCase();

      const title =
        data.title.toLowerCase();

      return (
        summary.includes(title) ||
        title.includes(summary)
      );
    }
  );

  if (
    !event?.id ||
    !data.email
  ) {
    return Response.json({
      source:
        "calendar-attendee",
      response:
        "❌ Event or email not found",
    });
  }

  await addAttendee(
    userId,
    event.id,
    event.summary ?? "",
    event.start?.dateTime ??
      "",
    event.end?.dateTime ??
      "",
    data.email
  );

  return Response.json({
    source:
      "calendar-attendee",
    response: `✅ Added ${data.email} to ${event.summary}`,
  });
}
    // =========================
    // GMAIL FLOW
    // =========================
if (isEmailQuery) {
  const emailDetails =
    await readEmails(
      userId,
      10
    );

  const formattedEmails =
    emailDetails
      .map(
        (email) =>
          `• ${email.subject}\n  From: ${email.from}`
      )
      .join("\n\n");

  return Response.json({
    source: "gmail",

    response:
      emailDetails.length > 0
        ? `Latest Emails\n\n${formattedEmails}`
        : "No emails found",

    emails: emailDetails,
  });
}

    if (
  isUpdateEventQuery(
    message
  )
) {
  const data =
    await extractUpdateEvent(
      message
    );

  const events =
    await getUpcomingEvents(
      userId,
      50
    );

  const event =
  events.find(
    (e) => {
      const summary =
        (
          e.summary ??
          ""
        ).toLowerCase();

      const title =
        data.title.toLowerCase();

      return (
        summary.includes(title) ||
        title.includes(summary)
      );
    }
  );

  if (!event?.id) {
    return Response.json({
      source:
        "calendar-update",
      response:
        "❌ Event not found",
    });
  }

  await updateEvent(
    userId,
    event.id,
    data.title,
    data.start,
    data.end
  );

  return Response.json({
    source:
      "calendar-update",
    response: `✅ Updated event: ${data.title}`,
  });
}
if (
  isDeleteEventQuery(
    message
  )
) {
  const data =
    extractDeleteEvent(
      message
    );

  const events =
    await getUpcomingEvents(
     userId, 50
    );

const event =
  events.find(
    (e) => {
      const summary =
        (
          e.summary ??
          ""
        ).toLowerCase();

      const title =
        data.title.toLowerCase();

      return (
        summary.includes(title) ||
        title.includes(summary)
      );
    }
  );;

  if (!event?.id) {
    return Response.json({
      source:
        "calendar-delete",
      response:
        "❌ Event not found",
    });
  }

  await deleteEvent(
    userId,
    event.id
  );

  return Response.json({
    source:
      "calendar-delete",
    response: `✅ Deleted event: ${event.summary}`,
  });
}
if (
  isEventDateRangeQuery(
    message
  )
) {
  const range =
    await extractEventDateRange(
      message
    );

  const events =
    await searchEvents(
      userId,
      range.startDate,
      range.endDate
    );

  const formattedEvents =
  events
    .map(
      (event: any) =>
        `• ${
          event.summary ??
          "Untitled Event"
        }\n  ${
          event.start?.dateTime ??
          event.start?.date ??
          ""
        }`
    )
    .join("\n\n");

return Response.json({
  source:
    "calendar-search",

  response:
    events.length > 0
      ? `Events Found\n\n${formattedEvents}`
      : "No events found",
});
}
if (
  isBusiestDayQuery(
    message
  )
) {
  const events =
    await getWeekEvents(
  userId
)

  const dayCount:
    Record<
      string,
      number
    > = {};

  events.forEach(
    (event) => {
      const date =
        event.data?.start?.dateTime ??
        event.data?.start?.date;

      if (!date) return;

      const day =
        new Date(
          date
        ).toLocaleDateString(
          "en-US",
          {
            weekday:
              "long",
          }
        );

      dayCount[day] =
        (dayCount[
          day
        ] ?? 0) + 1;
    }
  );

  let busiestDay =
    "";

  let max = 0;

  Object.entries(
    dayCount
  ).forEach(
    ([day, count]) => {
      if (
        count > max
      ) {
        max = count;
        busiestDay =
          day;
      }
    }
  );

  return Response.json({
    source:
      "calendar-busiest",
    response: `${busiestDay} is your busiest day with ${max} meetings.`,
  });
}
if (
  isMeetingCountQuery(
    message
  )
) {
const events =
  await getWeekEvents(
  userId
)

  return Response.json({
    source:
      "calendar-count",
    response: `You have ${events.length} meetings this week.`,
  });
}

if (
  isScheduleSummaryQuery(
    message
  )
) {
const events =
  await getUpcomingEvents(
   userId, 50
  );

  const result =
    await generateText({
      model: google(
        "gemini-2.5-flash"
      ),

      prompt: `
You are an AI calendar assistant.

User asked:
${message}

Calendar Events:
${JSON.stringify(
  events,
  null,
  2
)}

Provide:

1. Schedule summary
2. Important meetings
3. Free time observations
4. Busiest day if applicable

Format nicely.
`,
    });

  return Response.json({
    source:
      "calendar-summary",
    response:
      result.text,
  });
}
if (
  isUpcomingEventsQuery(
    message
  )
) {
  const events =
    await getUpcomingEvents(
      userId,
      10
    );

  const formattedEvents =
    events
      .map(
        (event: any) =>
          `• ${
            event.summary ??
            "Untitled Event"
          }\n  ${
            event.start?.dateTime ??
            event.start?.date ??
            ""
          }`
      )
      .join("\n\n");

  return Response.json({
    source:
      "calendar-upcoming",

    response:
      events.length > 0
        ? `Upcoming Events\n\n${formattedEvents}`
        : "No upcoming events",
  });
}
    // =========================
    // CALENDAR FLOW
  if (isCalendarQuery) {
  const events =
    await readEvents(
      userId,
      20
    );

  const formattedEvents =
    events
      .slice(0, 20)
      .map(
        (event: any) =>
          `• ${
            event.summary ??
            event.data?.summary ??
            "Untitled Event"
          }`
      )
      .join("\n");

  return Response.json({
    source:
      "calendar",

    response:
      events.length > 0
        ? `Calendar Events\n\n${formattedEvents}`
        : "No calendar events found",

    events,
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
