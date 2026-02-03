"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Variant = {
  id: string;
  sku: string;
  isActive: boolean;
  priceAmount?: number | null;
  currencyCode?: string | null;
};

type Props = {
  productId: string;
};

export default function VariantManager({ productId }: Props) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    sku: "",
    priceAmount: "",
    currencyCode: "INR",
    isActive: true,
  });

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`);
      const json = (await res.json().catch(() => null)) as Variant[] | { message?: string } | null;
      if (!res.ok || !Array.isArray(json)) {
        setError((json as { message?: string } | null)?.message || "Failed to load variants");
        return;
      }
      setVariants(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [productId]);

  async function createVariant(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sku: form.sku,
          priceAmount: form.priceAmount ? Number(form.priceAmount) : undefined,
          currencyCode: form.currencyCode || undefined,
          isActive: form.isActive,
        }),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to create variant");
        return;
      }
      setForm({ sku: "", priceAmount: "", currencyCode: "INR", isActive: true });
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function removeVariant(variantId: string) {
    if (!confirm("Delete this variant?")) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Failed to delete variant");
        return;
      }
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <form
        onSubmit={createVariant}
        className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end"
      >
        <div className="grid gap-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={form.sku}
            onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
            required
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
        <Button type="submit" disabled={loading}>
          Add variant
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {variants.length === 0 ? (
        <p className="text-sm text-muted-foreground">No variants yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">SKU</th>
                <th className="py-2">Price</th>
                <th className="py-2">Active</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id} className="border-b">
                  <td className="py-2">
                    <div className="font-medium">{variant.sku}</div>
                    <div className="text-xs text-muted-foreground">{variant.id}</div>
                  </td>
                  <td className="py-2">
                    {variant.priceAmount ?? "—"} {variant.currencyCode ?? ""}
                  </td>
                  <td className="py-2">{variant.isActive ? "Yes" : "No"}</td>
                  <td className="py-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariant(variant.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
