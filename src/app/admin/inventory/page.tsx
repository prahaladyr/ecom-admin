import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryLookup from "@/components/admin/inventory/inventory-lookup";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">Lookup and update product inventory.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryLookup />
        </CardContent>
      </Card>
    </div>
  );
}
