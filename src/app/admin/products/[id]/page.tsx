import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProductForm from "@/components/admin/products/edit-product-form";
import InventoryLookup from "@/components/admin/inventory/inventory-lookup";
import VariantManager from "@/components/admin/products/variant-manager";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const [productRes, categoriesRes, variantsRes, warehousesRes] = await Promise.all([
    backendFetch(`/api/v1/products/${params.id}`, { headers }),
    backendFetch("/api/v1/categories?page=1&limit=100", { headers }),
    backendFetch(`/api/v1/products/${params.id}/variants`, { headers }),
    backendFetch("/api/v1/warehouses", { headers }),
  ]);

  if (!productRes.ok) {
    return (
      <div className="space-y-4">
        <Link href="/admin/products" className="text-sm text-primary hover:underline">
          ← Back to products
        </Link>
        <p className="text-sm text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const product = (await productRes.json()) as {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    brand?: string | null;
    hsn?: string | null;
    images?: string[] | null;
    type?: "RETAIL" | "HARDWARE" | "RAW_MATERIAL" | "FINISHED_GOOD";
    priceAmount: number;
    currencyCode: string;
    isActive: boolean;
    categories?: { category: { id: string; name: string } }[];
  };

  const categoriesJson = (await categoriesRes.json().catch(() => null)) as {
    items?: { id: string; name: string }[];
  } | null;
  const categories = categoriesJson?.items ?? [];

  const variants =
    ((await variantsRes.json().catch(() => null)) as { id: string; sku: string }[] | null) ?? [];

  const warehouses =
    ((await warehousesRes.json().catch(() => null)) as { id: string; name: string }[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-primary hover:underline">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Edit product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProductForm product={product} categories={categories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryLookup variants={variants} warehouses={warehouses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <VariantManager productId={product.id} />
        </CardContent>
      </Card>
    </div>
  );
}
