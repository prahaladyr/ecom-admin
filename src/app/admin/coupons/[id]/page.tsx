import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditCouponForm from "@/components/admin/coupons/edit-coupon-form";

export default async function CouponDetailPage({ params }: { params: { id: string } }) {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch(`/api/v1/coupons/${params.id}`, { headers });

  if (!res.ok) {
    return (
      <div className="space-y-4">
        <Link href="/admin/coupons" className="text-sm text-primary hover:underline">
          ← Back to coupons
        </Link>
        <p className="text-sm text-muted-foreground">Coupon not found.</p>
      </div>
    );
  }

  const coupon = (await res.json()) as {
    id: string;
    code: string;
    type: "PERCENT" | "AMOUNT";
    value: number;
    isActive: boolean;
    startsAt?: string | null;
    endsAt?: string | null;
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/coupons" className="text-sm text-primary hover:underline">
          ← Back to coupons
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Edit coupon</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCouponForm coupon={coupon} />
        </CardContent>
      </Card>
    </div>
  );
}
