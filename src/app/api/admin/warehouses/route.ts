import { proxyWithAuth, proxyPublic } from "@/lib/admin-proxy";

export async function GET() {
  return proxyPublic("/api/v1/warehouses", { method: "GET" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth("/api/v1/warehouses", { method: "POST", json: body });
}
