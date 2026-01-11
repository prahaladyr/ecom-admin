import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, isProduction } from "@/lib/auth-cookies";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    await backendFetch("/api/v1/auth/logout", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }).catch(() => undefined);
  }

  const clearBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
    maxAge: 0,
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, "", clearBase);
  cookieStore.set(REFRESH_TOKEN_COOKIE, "", clearBase);

  return NextResponse.json({ success: true });
}
