import { proxyWithAuth } from "@/lib/admin-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = `/api/v1/users${url.search}`;
  return proxyWithAuth(path, { method: "GET" });
}
