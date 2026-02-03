import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateWarehouseForm from "@/components/admin/warehouses/create-warehouse-form";

type Warehouse = {
  id: string;
  name: string;
  city?: string | null;
  country?: string | null;
  isDefault: boolean;
};

export default async function WarehousesPage() {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch("/api/v1/warehouses", { headers });
  const warehouses = ((await res.json().catch(() => null)) as Warehouse[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Warehouses</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage stock locations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateWarehouseForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          {warehouses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No warehouses yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Name</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Country</th>
                    <th className="py-2">Default</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="border-b">
                      <td className="py-2">
                        <div className="font-medium">{warehouse.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {warehouse.city ?? "—"} · {warehouse.country ?? "—"}
                        </div>
                      </td>
                      <td className="py-2 hidden sm:table-cell">{warehouse.city ?? "—"}</td>
                      <td className="py-2 hidden sm:table-cell">{warehouse.country ?? "—"}</td>
                      <td className="py-2 hidden sm:table-cell">
                        {warehouse.isDefault ? "Yes" : "No"}
                      </td>
                      <td className="py-2">
                        <Link
                          className="text-sm text-primary hover:underline"
                          href={`/admin/warehouses/${warehouse.id}`}
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
