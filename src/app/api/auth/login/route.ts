import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, isProduction } from "@/lib/auth-cookies";

type LoginResponse = {
  user: { id: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;
  const email = (body as { email?: unknown })?.email;
  const password = (body as { password?: unknown })?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ message: "email and password are required" }, { status: 400 });
  }

  const res = await backendFetch("/api/v1/auth/login", {
    method: "POST",
    json: { email, password },
  });

  const json = (await res.json().catch(() => null)) as LoginResponse | null;

  if (!res.ok || !json?.accessToken || !json?.refreshToken) {
    const message = (json as { message?: string })?.message || "Login failed";
    return NextResponse.json({ message }, { status: res.status || 500 });
  }

  const cookieBase = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
  };

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, json.accessToken, {
    ...cookieBase,
    maxAge: 15 * 60,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, json.refreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60,
  });

  return NextResponse.json({ user: json.user });
}
