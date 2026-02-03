import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryLookup from "@/components/admin/inventory/inventory-lookup";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";

type Warehouse = { id: string; name: string };

export default async function InventoryPage() {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch("/api/v1/warehouses", { headers });
  const warehouses = ((await res.json().catch(() => null)) as Warehouse[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lookup and update variant inventory by warehouse.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryLookup warehouses={warehouses} />
        </CardContent>
      </Card>
    </div>
  );
}
