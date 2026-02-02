import { proxyWithAuth } from "@/lib/admin-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = `/api/v1/coupons${url.search}`;
  return proxyWithAuth(path, { method: "GET" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth("/api/v1/coupons", { method: "POST", json: body });
}
