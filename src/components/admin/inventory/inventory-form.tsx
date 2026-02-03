"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  variantId: string;
  warehouseId: string;
};

type InventoryRecord = {
  id: string;
  quantityAvailable: number;
  quantityReserved: number;
  reorderLevel?: number | null;
};

export default function InventoryForm({ variantId, warehouseId }: Props) {
  const router = useRouter();
  const [quantityAvailable, setQuantityAvailable] = useState("0");
  const [quantityReserved, setQuantityReserved] = useState("0");
  const [reorderLevel, setReorderLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<InventoryRecord | null>(null);
  const [inventoryId, setInventoryId] = useState<string | null>(null);

  async function load() {
    setError(null);
    const res = await fetch(
      `/api/admin/inventory?variantId=${variantId}&warehouseId=${warehouseId}`,
    );
    const json = (await res.json().catch(() => null)) as
      | InventoryRecord[]
      | { message?: string }
      | null;
    if (!res.ok || !Array.isArray(json)) {
      setError((json as { message?: string } | null)?.message || "Failed to load inventory");
      return;
    }
    const record = json[0] ?? null;
    setCurrent(record);
    setInventoryId(record?.id ?? null);
    setQuantityAvailable(String(record?.quantityAvailable ?? 0));
    setQuantityReserved(String(record?.quantityReserved ?? 0));
    setReorderLevel(record?.reorderLevel != null ? String(record.reorderLevel) : "");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        variantId,
        warehouseId,
        quantityAvailable: Number(quantityAvailable),
        quantityReserved: Number(quantityReserved),
        reorderLevel: reorderLevel ? Number(reorderLevel) : undefined,
      };

      const res = await fetch(
        inventoryId ? `/api/admin/inventory/${inventoryId}` : "/api/admin/inventory",
        {
          method: inventoryId ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
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
        <span className="text-muted-foreground">Current available</span>
        <span>{current?.quantityAvailable ?? "Not loaded"}</span>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={load}>
        Load current inventory
      </Button>

      <div className="grid gap-2">
        <Label htmlFor="quantityAvailable">Available quantity</Label>
        <Input
          id="quantityAvailable"
          type="number"
          min={0}
          value={quantityAvailable}
          onChange={(event) => setQuantityAvailable(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="quantityReserved">Reserved quantity</Label>
        <Input
          id="quantityReserved"
          type="number"
          min={0}
          value={quantityReserved}
          onChange={(event) => setQuantityReserved(event.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reorderLevel">Reorder level</Label>
        <Input
          id="reorderLevel"
          type="number"
          min={0}
          value={reorderLevel}
          onChange={(event) => setReorderLevel(event.target.value)}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Update inventory"}
      </Button>
    </form>
  );
}
