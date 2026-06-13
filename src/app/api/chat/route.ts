import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { createEvent } from "@/lib/calendar/createEvent";
import { sendEmail } from "@/lib/gmail/sendEmail";
import { extractEmail } from "@/lib/ai/extractEmail";
import { extractEvent } from "@/lib/ai/extractEvent";
import { extractMultiAction } from "@/lib/ai/extractMultiAction";
import { createIssue } from "@/lib/github/createIssue";
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
    owner,
    repoData.repo
  );

  return Response.json({
    source: "github-star",
    response: `⭐ Repository ${repoData.repo} starred successfully`,
  });
}
if (isGithubRepoQuery(message)) {
  const repos = await listRepos();

  const repoNames = repos.map((repo: any) => ({
    name: repo.name,
    owner: repo.owner?.login,
    url: repo.html_url,
  }));

  return Response.json({
    source: "github-repos",
    response: `Found ${repoNames.length} repositories`,
    repos: repoNames,
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
    owner,
    issueData.repo
  );

  return Response.json({
    source: "github-issues",
    response: `Found ${issues.length} issues`,
    issues,
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

  const repo = await findRepo(
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
      owner,
      repoData.repo
    );

  return Response.json({
    source: "github-prs",
    response: `Found ${prs.length} pull requests`,
    prs,
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

  const repo = await findRepo(
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
    await listBranches(
      owner,
      repoData.repo
    );

  return Response.json({
    source: "github-branches",
    response: `Found ${branches.length} branches`,
    branches,
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

  const repo = await findRepo(
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
      owner,
      repoData.repo
    );

  return Response.json({
    source: "github-commits",
    response: `Found ${commits.length} commits`,
    commits,
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

  const repo = await findRepo(
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
  await getFileContent(
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
