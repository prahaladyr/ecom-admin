import { proxyWithAuth, proxyPublic } from "@/lib/admin-proxy";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return proxyPublic(`/api/v1/warehouses/${params.id}`, { method: "GET" });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/warehouses/${params.id}`, { method: "PATCH", json: body });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return proxyWithAuth(`/api/v1/warehouses/${params.id}`, { method: "DELETE" });
}
