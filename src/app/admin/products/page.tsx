import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateProductForm from "@/components/admin/products/create-product-form";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  priceAmount: number;
  currencyCode: string;
  isActive: boolean;
  category?: { id: string; name: string } | null;
};

export default async function ProductsPage() {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const [productsRes, categoriesRes] = await Promise.all([
    backendFetch("/api/v1/products?page=1&limit=100", { headers }),
    backendFetch("/api/v1/categories?page=1&limit=100", { headers }),
  ]);

  const productsJson = (await productsRes.json().catch(() => null)) as { items?: Product[] } | null;
  const categoriesJson = (await categoriesRes.json().catch(() => null)) as {
    items?: Category[];
  } | null;

  const products = productsJson?.items ?? [];
  const categories = categoriesJson?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage catalog products.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create product</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProductForm categories={categories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Name</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b sm:table-row">
                      <td className="py-2">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {product.priceAmount} {product.currencyCode} ·{" "}
                          {product.category?.name ?? "—"}
                        </div>
                      </td>
                      <td className="py-2 hidden sm:table-cell">
                        {product.priceAmount} {product.currencyCode}
                      </td>
                      <td className="py-2 hidden sm:table-cell">{product.category?.name ?? "—"}</td>
                      <td className="py-2 hidden sm:table-cell">
                        {product.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="py-2">
                        <Link
                          className="text-sm text-primary hover:underline"
                          href={`/admin/products/${product.id}`}
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
