import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStatusForm from "@/components/admin/orders/order-status-form";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lookup order status and update it for fulfillment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusForm />
        </CardContent>
      </Card>
    </div>
  );
}
