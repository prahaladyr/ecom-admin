import Link from "next/link";
import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditCategoryForm from "@/components/admin/categories/edit-category-form";

export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  const accessToken = await getAccessToken();
  const headers = accessToken ? { authorization: `Bearer ${accessToken}` } : undefined;

  const [categoryRes, categoriesRes] = await Promise.all([
    backendFetch(`/api/v1/categories/${params.id}`, { headers }),
    backendFetch("/api/v1/categories?page=1&limit=100", { headers }),
  ]);

  if (!categoryRes.ok) {
    return (
      <div className="space-y-4">
        <Link href="/admin/categories" className="text-sm text-primary hover:underline">
          ← Back to categories
        </Link>
        <p className="text-sm text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  const category = (await categoryRes.json()) as {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
  };

  const categoriesJson = (await categoriesRes.json().catch(() => null)) as {
    items?: { id: string; name: string }[];
  } | null;
  const categories = categoriesJson?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/categories" className="text-sm text-primary hover:underline">
          ← Back to categories
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Edit category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditCategoryForm category={category} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
