import { proxyPublic } from "@/lib/admin-proxy";

const CART_HEADER = "x-cart-id";

export async function GET(request: Request) {
  const cartId = request.headers.get(CART_HEADER);
  const headers = cartId ? { [CART_HEADER]: cartId } : undefined;
  return proxyPublic("/api/v1/cart", { method: "GET", headers });
}
