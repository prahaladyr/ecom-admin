import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCouponForm from "@/components/admin/coupons/create-coupon-form";

type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "AMOUNT";
  value: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

export default async function CouponsPage() {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch("/api/v1/coupons?page=1&limit=100", { headers });
  const json = (await res.json().catch(() => null)) as { items?: Coupon[] } | null;
  const coupons = json?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage discount codes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCouponForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No coupons yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Code</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Value</th>
                    <th className="py-2">Active</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b">
                      <td className="py-2">
                        <div className="font-medium">{coupon.code}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {coupon.type} · {coupon.value} · {coupon.isActive ? "Active" : "Inactive"}
                        </div>
                      </td>
                      <td className="py-2 hidden sm:table-cell">{coupon.type}</td>
                      <td className="py-2 hidden sm:table-cell">{coupon.value}</td>
                      <td className="py-2 hidden sm:table-cell">
                        {coupon.isActive ? "Yes" : "No"}
                      </td>
                      <td className="py-2">
                        <Link
                          className="text-sm text-primary hover:underline"
                          href={`/admin/coupons/${coupon.id}`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
