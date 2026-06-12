export async function extractGithubComment(
  message: string
) {
  const repoMatch =
    message.match(
      /in\s+([A-Za-z0-9_-]+)/i
    );

  const issueMatch =
    message.match(
      /issue\s+(\d+)/i
    );

  const body = message
    .replace(
      /Add comment on issue\s+\d+\s+in\s+[A-Za-z0-9_-]+/i,
      ""
    )
    .trim();
console.log({
  repo: repoMatch?.[1],
  issueNumber: Number(issueMatch?.[1]),
  body,
});
  return {
    repo: repoMatch?.[1],
    issueNumber: Number(
      issueMatch?.[1]
    ),
    body,
  };
}