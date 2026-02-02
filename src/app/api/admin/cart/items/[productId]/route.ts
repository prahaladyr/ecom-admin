import { proxyPublic } from "@/lib/admin-proxy";

const CART_HEADER = "x-cart-id";

export async function PATCH(request: Request, { params }: { params: { productId: string } }) {
  const cartId = request.headers.get(CART_HEADER);
  const headers = cartId ? { [CART_HEADER]: cartId } : undefined;
  const body = await request.json().catch(() => ({}));
  return proxyPublic(`/api/v1/cart/items/${params.productId}`, {
    method: "PATCH",
    headers,
    json: body,
  });
}

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
  const cartId = request.headers.get(CART_HEADER);
  const headers = cartId ? { [CART_HEADER]: cartId } : undefined;
  return proxyPublic(`/api/v1/cart/items/${params.productId}`, { method: "DELETE", headers });
}
