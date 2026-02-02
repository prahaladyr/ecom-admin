"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InventoryForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);

  async function load() {
    setError(null);
    const res = await fetch(`/api/admin/inventory/${productId}`);
    const json = (await res.json().catch(() => null)) as {
      quantity?: number;
      message?: string;
    } | null;
    if (!res.ok || typeof json?.quantity !== "number") {
      setError(json?.message || "Failed to load inventory");
      return;
    }
    setCurrent(json.quantity);
    setQuantity(String(json.quantity));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/${productId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity: Number(quantity) }),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        setError(json?.message || "Failed to update inventory");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Current quantity</span>
        <span>{current ?? "Not loaded"}</span>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={load}>
        Load current inventory
      </Button>

      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min={0}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Update inventory"}
      </Button>
    </form>
  );
}
