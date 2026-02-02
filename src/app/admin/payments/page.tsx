import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentIntentForm from "@/components/admin/payments/payment-intent-form";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create payment intents for orders using the configured providers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create payment intent</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentIntentForm />
        </CardContent>
      </Card>
    </div>
  );
}
