import { proxyPublic } from "@/lib/admin-proxy";

const CART_HEADER = "x-cart-id";

export async function POST(request: Request) {
  const cartId = request.headers.get(CART_HEADER);
  const headers = cartId ? { [CART_HEADER]: cartId } : undefined;
  const body = await request.json().catch(() => ({}));
  return proxyPublic("/api/v1/cart/items", { method: "POST", headers, json: body });
}
