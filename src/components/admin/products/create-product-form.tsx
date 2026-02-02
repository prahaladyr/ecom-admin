"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CategoryOption = { id: string; name: string };

type Props = {
  categories: CategoryOption[];
};

export default function CreateProductForm({ categories }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    priceAmount: "",
    currencyCode: "INR",
    isActive: true,
    categoryId: "",
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description || undefined,
      priceAmount: Number(form.priceAmount),
      currencyCode: form.currencyCode || undefined,
      isActive: form.isActive,
      categoryId: form.categoryId || undefined,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to create product");
        return;
      }
      setForm({
        name: "",
        slug: "",
        description: "",
        priceAmount: "",
        currencyCode: "INR",
        isActive: true,
        categoryId: "",
      });
      router.refresh();
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
          placeholder="auto-generated if blank"
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
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={form.categoryId}
          onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
        >
          <option value="">Unassigned</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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

      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create product"}
      </Button>
    </form>
  );
}
