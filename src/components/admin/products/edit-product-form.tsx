"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CategoryOption = { id: string; name: string };

const PRODUCT_TYPES = ["RETAIL", "HARDWARE", "RAW_MATERIAL", "FINISHED_GOOD"] as const;

type Product = {
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

type Props = {
  product: Product;
  categories: CategoryOption[];
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  brand: string;
  hsn: string;
  images: string;
  priceAmount: string;
  currencyCode: string;
  type: (typeof PRODUCT_TYPES)[number];
  isActive: boolean;
  categoryIds: string[];
};

export default function EditProductForm({ product, categories }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    brand: product.brand ?? "",
    hsn: product.hsn ?? "",
    images: product.images?.join(", ") ?? "",
    priceAmount: String(product.priceAmount),
    currencyCode: product.currencyCode,
    type: product.type ?? "RETAIL",
    isActive: product.isActive,
    categoryIds: product.categories?.map((entry) => entry.category.id) ?? [],
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description || undefined,
      brand: form.brand || undefined,
      hsn: form.hsn || undefined,
      images: form.images
        ? form.images
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : undefined,
      priceAmount: Number(form.priceAmount),
      currencyCode: form.currencyCode || undefined,
      type: form.type,
      isActive: form.isActive,
      categoryIds: form.categoryIds.length > 0 ? form.categoryIds : undefined,
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to update product");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Failed to delete product");
        return;
      }
      router.replace("/admin/products");
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
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={form.brand}
          onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="hsn">HSN</Label>
        <Input
          id="hsn"
          value={form.hsn}
          onChange={(event) => setForm((prev) => ({ ...prev, hsn: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="images">Images (comma-separated URLs)</Label>
        <Input
          id="images"
          value={form.images}
          onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="priceAmount">Price (minor units)</Label>
        <Input
          id="priceAmount"
          type="number"
          min={0}
          value={form.priceAmount}
          onChange={(event) => setForm((prev) => ({ ...prev, priceAmount: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="currencyCode">Currency</Label>
        <Input
          id="currencyCode"
          value={form.currencyCode}
          onChange={(event) => setForm((prev) => ({ ...prev, currencyCode: event.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Product type</Label>
        <select
          id="type"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={form.type}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              type: event.target.value as (typeof PRODUCT_TYPES)[number],
            }))
          }
        >
          {PRODUCT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="categoryIds">Categories</Label>
        <select
          id="categoryIds"
          multiple
          className="min-h-32 rounded-md border bg-background px-3 py-2 text-sm"
          value={form.categoryIds}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              categoryIds: Array.from(event.target.selectedOptions).map((option) => option.value),
            }))
          }
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">Hold ⌘/Ctrl to select multiple.</p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
        />
        Active
      </label>

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
