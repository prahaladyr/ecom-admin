import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditWarehouseForm from "@/components/admin/warehouses/edit-warehouse-form";

type Warehouse = {
  id: string;
  name: string;
  city?: string | null;
  country?: string | null;
  isDefault: boolean;
};

export default async function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch(`/api/v1/warehouses/${params.id}`, { headers });
  if (!res.ok) {
    return (
      <div className="space-y-4">
        <Link href="/admin/warehouses" className="text-sm text-primary hover:underline">
          ← Back to warehouses
        </Link>
        <p className="text-sm text-muted-foreground">Warehouse not found.</p>
      </div>
    );
  }

  const warehouse = (await res.json()) as Warehouse;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/warehouses" className="text-sm text-primary hover:underline">
          ← Back to warehouses
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Edit warehouse</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWarehouseForm warehouse={warehouse} />
        </CardContent>
      </Card>
    </div>
  );
}
