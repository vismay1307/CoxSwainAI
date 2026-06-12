import { corsair } from "@/server/corsair";

export async function readEmails(
  maxResults = 5
) {
  const tenant = corsair.withTenant("default");

  const emailList =
    await tenant.gmail.api.messages.list({
      maxResults,
    });

  return Promise.all(
    (emailList.messages ?? []).map(
      async (email) => {
        const fullEmail =
          await tenant.gmail.api.messages.get({
            id: email.id!,
            format: "full",
          });

        const headers =
          fullEmail.payload?.headers ?? [];

        const subject =
          headers.find(
            (h) =>
              h.name?.toLowerCase() ===
              "subject"
          )?.value ?? "No Subject";

        const from =
          headers.find(
            (h) =>
              h.name?.toLowerCase() === "from"
          )?.value ?? "Unknown Sender";

        return {
          id: fullEmail.id,
          subject,
          from,
          snippet: fullEmail.snippet,
        };
      }
    )
  );
}