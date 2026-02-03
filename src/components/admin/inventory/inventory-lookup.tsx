"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InventoryForm from "@/components/admin/inventory/inventory-form";

type VariantOption = { id: string; sku: string };
type WarehouseOption = { id: string; name: string };

type Props = {
  variants?: VariantOption[];
  warehouses?: WarehouseOption[];
};

export default function InventoryLookup({ variants = [], warehouses = [] }: Props) {
  const [variantId, setVariantId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [active, setActive] = useState<{ variantId: string; warehouseId: string } | null>(null);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="variantId">Variant</Label>
        {variants.length > 0 ? (
          <select
            id="variantId"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
          >
            <option value="">Select variant</option>
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.sku} · {variant.id}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id="variantId"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
            placeholder="UUID"
          />
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="warehouseId">Warehouse</Label>
        {warehouses.length > 0 ? (
          <select
            id="warehouseId"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={warehouseId}
            onChange={(event) => setWarehouseId(event.target.value)}
          >
            <option value="">Select warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name} · {warehouse.id}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id="warehouseId"
            value={warehouseId}
            onChange={(event) => setWarehouseId(event.target.value)}
            placeholder="UUID"
          />
        )}
      </div>

      <Button
        type="button"
        onClick={() => setActive({ variantId, warehouseId })}
        disabled={!variantId || !warehouseId}
      >
        Load inventory
      </Button>

      {active ? (
        <InventoryForm variantId={active.variantId} warehouseId={active.warehouseId} />
      ) : null}
    </div>
  );
}
