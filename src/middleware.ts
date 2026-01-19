import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookies";

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (accessToken) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const backendBaseUrl = process.env.BACKEND_BASE_URL;
  if (!backendBaseUrl) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const refreshUrl = `${backendBaseUrl.replace(/\/$/, "")}/api/v1/auth/refresh`;

  const res = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(ACCESS_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
    redirect.cookies.set(REFRESH_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
    return redirect;
  }

  const json = (await res.json().catch(() => null)) as {
    accessToken?: string;
    refreshToken?: string;
  } | null;

  if (!json?.accessToken || !json?.refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  response.cookies.set(ACCESS_TOKEN_COOKIE, json.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, json.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
