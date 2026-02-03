import { proxyWithAuth, proxyPublic } from "@/lib/admin-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.search ? url.search : "";
  return proxyPublic(`/api/v1/inventory${search}`, { method: "GET" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/inventory`, { method: "POST", json: body });
}
