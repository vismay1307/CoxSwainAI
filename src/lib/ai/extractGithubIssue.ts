export async function extractGithubIssue(
  message: string
) {
  const repoMatch =
    message.match(/issue in ([^\n]+)/i);

  const titleMatch =
    message.match(/title:\s*(.+)/i);

  const bodyMatch =
    message.match(/body:\s*(.+)/i);

  return {
    repo: repoMatch?.[1]?.trim(),
    title: titleMatch?.[1]?.trim(),
    body: bodyMatch?.[1]?.trim(),
  };
}