import { proxyWithAuth, proxyPublic } from "@/lib/admin-proxy";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return proxyPublic(`/api/v1/products/${params.id}/variants`, { method: "GET" });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/products/${params.id}/variants`, { method: "POST", json: body });
}
