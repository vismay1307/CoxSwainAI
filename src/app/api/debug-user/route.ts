import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  console.log("USER ID =", userId);

  return Response.json({
    userId,
  });
}