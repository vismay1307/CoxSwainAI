import { corsair } from "@/server/corsair";

export async function GET() {
  const tenant = corsair.withTenant("default");

  try {
    const result =
      await tenant.github.api.issues.create({
        owner: "chaicodehq",
        repo: "js-conditionals-vismay1307",

        title: "CoxswainAI Test Issue",

        body: "Issue created by CoxswainAI GitHub integration.",
      });

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json({
      error,
    });
  }
}