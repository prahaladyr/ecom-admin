import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CartManager from "@/components/admin/cart/cart-manager";

export default function CartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inspect and manage cart contents (Redis-backed).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cart tools</CardTitle>
        </CardHeader>
        <CardContent>
          <CartManager />
        </CardContent>
      </Card>
    </div>
  );
}
