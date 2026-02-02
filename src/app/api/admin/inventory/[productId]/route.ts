import { proxyWithAuth, proxyPublic } from "@/lib/admin-proxy";

export async function GET(_: Request, { params }: { params: { productId: string } }) {
  return proxyPublic(`/api/v1/inventory/${params.productId}`, { method: "GET" });
}

export async function PUT(request: Request, { params }: { params: { productId: string } }) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/inventory/${params.productId}`, { method: "PUT", json: body });
}
