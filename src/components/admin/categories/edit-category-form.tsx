"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CategoryOption = { id: string; name: string };

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

type Props = {
  category: Category;
  categories: CategoryOption[];
};

export default function EditCategoryForm({ category, categories }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
    parentId: category.parentId ?? "",
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      parentId: form.parentId || undefined,
    };

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to update category");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete category");
        return;
      }
      router.replace("/admin/categories");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="parentId">Parent category</Label>
        <select
          id="parentId"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={form.parentId}
          onChange={(event) => setForm((prev) => ({ ...prev, parentId: event.target.value }))}
        >
          <option value="">None</option>
          {categories
            .filter((item) => item.id !== category.id)
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onDelete} disabled={loading}>
          Delete
        </Button>
      </div>
    </form>
  );
}
