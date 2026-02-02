import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCategoryForm from "@/components/admin/categories/create-category-form";

type Category = { id: string; name: string; slug: string; parentId?: string | null };

export default async function CategoriesPage() {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const res = await backendFetch("/api/v1/categories?page=1&limit=100", { headers });
  const json = (await res.json().catch(() => null)) as { items?: Category[] } | null;
  const categories = json?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">Organize products into categories.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create category</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm categories={categories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Name</th>
                    <th className="py-2">Slug</th>
                    <th className="py-2">Parent</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b">
                      <td className="py-2">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {category.slug} ·{" "}
                          {categories.find((item) => item.id === category.parentId)?.name ?? "—"}
                        </div>
                      </td>
                      <td className="py-2 hidden sm:table-cell">{category.slug}</td>
                      <td className="py-2 hidden sm:table-cell">
                        {categories.find((item) => item.id === category.parentId)?.name ?? "—"}
                      </td>
                      <td className="py-2">
                        <Link
                          className="text-sm text-primary hover:underline"
                          href={`/admin/categories/${category.id}`}
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
