import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";

type ProxyInit = RequestInit & { json?: unknown };

export async function proxyWithAuth(path: string, init: ProxyInit) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${accessToken}`);

  const res = await backendFetch(path, { ...init, headers });
  const json = (await res.json().catch(() => null)) as unknown;

  if (json === null) {
    return NextResponse.json({ success: res.ok }, { status: res.status });
  }

  return NextResponse.json(json, { status: res.status });
}

export async function proxyPublic(path: string, init: ProxyInit) {
  const res = await backendFetch(path, init);
  const json = (await res.json().catch(() => null)) as unknown;

  if (json === null) {
    return NextResponse.json({ success: res.ok }, { status: res.status });
  }

  return NextResponse.json(json, { status: res.status });
}
