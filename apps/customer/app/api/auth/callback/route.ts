import { createSession } from "@/lib/session";
import { Role } from "@workspace/ui/enum/user.enum";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userId = searchParams.get("userId");
  const name = searchParams.get("name") || " ";
  const email = searchParams.get("email");
  const role = searchParams.get("role");
  const profileImage = searchParams.get("profileImage") ?? undefined;

  if (!accessToken || !refreshToken || !userId || !name || !role || !email)
    throw new Error("Google Oauth Failed!");

  await createSession({
    user: {
      id: userId,
      name: name,
      email: email,
      role: role as Role,
      profileImage,
    },
    accessToken,
    refreshToken,
  });

  redirect("/dashboard");
}
