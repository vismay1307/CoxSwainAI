import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant = corsair.withTenant("default");

  const email = [
    "To: vismaywork49@gmail.com",
    "Subject: Coxswain AI Test Email",
    "",
    "Hello from Coxswain AI 🚀",
  ].join("\n");

  const raw = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const result =
    await tenant.gmail.api.messages.send({
      raw,
    });

  return Response.json(result);
}