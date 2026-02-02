import { proxyWithAuth } from "@/lib/admin-proxy";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/coupons/${params.id}`, { method: "PATCH", json: body });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return proxyWithAuth(`/api/v1/coupons/${params.id}`, { method: "DELETE" });
}
