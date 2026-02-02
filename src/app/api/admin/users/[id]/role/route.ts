import { proxyWithAuth } from "@/lib/admin-proxy";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/users/${params.id}/role`, { method: "PATCH", json: body });
}
