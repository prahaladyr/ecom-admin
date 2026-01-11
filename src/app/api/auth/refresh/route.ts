import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, isProduction } from "@/lib/auth-cookies";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const res = await backendFetch("/api/v1/auth/refresh", {
    method: "POST",
    json: { refreshToken },
  });

  const json = (await res.json().catch(() => null)) as RefreshResponse | null;

  if (!res.ok || !json?.accessToken || !json?.refreshToken) {
    return NextResponse.json({ message: "Refresh failed" }, { status: res.status || 401 });
  }

  const cookieBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, json.accessToken, {
    ...cookieBase,
    maxAge: 15 * 60,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, json.refreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60,
  });

  return NextResponse.json({ success: true });
}
