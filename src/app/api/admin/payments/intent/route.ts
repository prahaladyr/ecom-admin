import { proxyWithAuth } from "@/lib/admin-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth("/api/v1/payments/intent", { method: "POST", json: body });
}
