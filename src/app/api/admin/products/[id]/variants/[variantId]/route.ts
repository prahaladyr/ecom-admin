import { proxyWithAuth } from "@/lib/admin-proxy";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; variantId: string } },
) {
  const body = await request.json().catch(() => ({}));
  return proxyWithAuth(`/api/v1/products/${params.id}/variants/${params.variantId}`, {
    method: "PATCH",
    json: body,
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; variantId: string } },
) {
  return proxyWithAuth(`/api/v1/products/${params.id}/variants/${params.variantId}`, {
    method: "DELETE",
  });
}
