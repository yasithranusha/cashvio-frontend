"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { SESSION_SECRET } from "@/lib/constants";
import { Session } from "@workspace/ui/types/user";

const encodedKey = new TextEncoder().encode(SESSION_SECRET);

export async function createSession(payload: Session) {
  if (!payload.accessToken || !payload.refreshToken || !payload.user?.id) {
    throw new Error("Invalid session data");
  }

  await deleteSession();

  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session:", err);
    await deleteSession();
    return null;
  }
}

export async function updateSession(userData: Partial<Session["user"]>) {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify<Session>(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    if (!payload) return null;

    const newPayload: Session = {
      user: {
        ...payload.user,
        ...userData,
      },
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };

    await deleteSession();
    await createSession(newPayload);

    return await getSession();
  } catch (error) {
    console.error("Failed to update session:", error);
    await deleteSession();
    return null;
  }
}

export async function deleteSession() {
  try {
    (await cookies()).delete("session");
  } catch (error) {
    console.error("Failed to delete session:", error);
  }
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify<Session>(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    if (!payload) return null;

    const newPayload: Session = {
      user: {
        ...payload.user,
      },
      accessToken,
      refreshToken,
    };

    await createSession(newPayload);
    return true;
  } catch (error) {
    console.error("Failed to update tokens:", error);
    await deleteSession();
    return null;
  }
}
